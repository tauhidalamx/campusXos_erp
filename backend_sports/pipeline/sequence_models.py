# -*- coding: utf-8 -*-
"""
CampusX Sports OS - Temporal Possession & Momentum Prediction Models
Implements an LSTM/RNN sequence model and a Self-Attention Transformer model.
Includes PyTorch execution blocks with custom NumPy matrix-propagation fallbacks
to ensure portability across lightweight CPUs and accelerated GPUs.
"""

import time
import math
from typing import Dict, Any, Tuple, List

# Attempt importing ML libraries
try:
    import numpy as np
    NUMPY_AVAILABLE = True
except ImportError:
    NUMPY_AVAILABLE = False

try:
    import torch
    import torch.nn as nn
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False


# ==========================================
# 1. PYTORCH DEFINITIONS (GPU ACCELERATED)
# ==========================================
if TORCH_AVAILABLE:
    class PyTorchLSTMModel(nn.Module):
        def __init__(self, input_dim: int = 5, hidden_dim: int = 16, output_dim: int = 2):
            super().__init__()
            self.lstm = nn.LSTM(input_dim, hidden_dim, batch_first=True)
            self.fc = nn.Linear(hidden_dim, output_dim)

        def forward(self, x: torch.Tensor) -> torch.Tensor:
            # x shape: (batch_size, seq_len, input_dim)
            lstm_out, _ = self.lstm(x)
            # Take last temporal step output
            last_step = lstm_out[:, -1, :]
            return torch.softmax(self.fc(last_step), dim=-1)

    class PyTorchTransformerModel(nn.Module):
        def __init__(self, input_dim: int = 5, embed_dim: int = 16, num_heads: int = 2, output_dim: int = 2):
            super().__init__()
            self.project = nn.Linear(input_dim, embed_dim)
            encoder_layer = nn.TransformerEncoderLayer(
                d_model=embed_dim, 
                nhead=num_heads, 
                dim_feedforward=32, 
                batch_first=True,
                activation='gelu'
            )
            self.transformer = nn.TransformerEncoder(encoder_layer, num_layers=1)
            self.fc = nn.Linear(embed_dim, output_dim)

        def forward(self, x: torch.Tensor) -> torch.Tensor:
            # x shape: (batch_size, seq_len, input_dim)
            embedded = self.project(x)
            trans_out = self.transformer(embedded)
            # Take last temporal step
            last_step = trans_out[:, -1, :]
            return torch.softmax(self.fc(last_step), dim=-1)


# ==========================================
# 2. NUMPY COMPATIBLE MATH FALLBACKS
# ==========================================
class NumpyLSTMModel:
    """
    Manual implementation of LSTM cell forward propagation.
    Used when PyTorch is not available or for ultra-lightweight execution.
    """
    def __init__(self, input_dim: int = 5, hidden_dim: int = 16, output_dim: int = 2):
        self.input_dim = input_dim
        self.hidden_dim = hidden_dim
        self.output_dim = output_dim
        
        # Initialize deterministic pseudo-random weights
        # Concatenated weights for gates: forget, input, cell, output [f, i, c, o]
        concat_dim = input_dim + hidden_dim
        np.random.seed(42)
        self.W = np.random.randn(hidden_dim * 4, concat_dim) * 0.1
        self.b = np.zeros((hidden_dim * 4, 1))
        
        # Classification layer
        self.W_fc = np.random.randn(output_dim, hidden_dim) * 0.1
        self.b_fc = np.zeros((output_dim, 1))

    def _sigmoid(self, x):
        return 1.0 / (1.0 + np.exp(-np.clip(x, -50, 50)))

    def forward(self, x: Any) -> Any:
        # Input shape: (batch_size, seq_len, input_dim)
        # x is a NumPy array
        batch_size, seq_len, _ = x.shape
        h = np.zeros((self.hidden_dim, batch_size))
        c = np.zeros((self.hidden_dim, batch_size))

        for t in range(seq_len):
            xt = x[:, t, :].T # shape: (input_dim, batch_size)
            concat = np.vstack((h, xt)) # shape: (hidden_dim + input_dim, batch_size)
            
            gates = np.dot(self.W, concat) + self.b # shape: (4 * hidden_dim, batch_size)
            
            # Split gates
            f_gate = self._sigmoid(gates[0 : self.hidden_dim])
            i_gate = self._sigmoid(gates[self.hidden_dim : 2 * self.hidden_dim])
            c_tilde = np.tanh(gates[2 * self.hidden_dim : 3 * self.hidden_dim])
            o_gate = self._sigmoid(gates[3 * self.hidden_dim :])
            
            c = f_gate * c + i_gate * c_tilde
            h = o_gate * np.tanh(c)

        # Classification FC layer
        logits = np.dot(self.W_fc, h) + self.b_fc # shape: (output_dim, batch_size)
        # Softmax along columns
        exp_logits = np.exp(logits - np.max(logits, axis=0, keepdims=True))
        probs = exp_logits / np.sum(exp_logits, axis=0, keepdims=True)
        return probs.T # shape: (batch_size, output_dim)


class NumpyTransformerModel:
    """
    Manual single-head self-attention Transformer step fallback.
    """
    def __init__(self, input_dim: int = 5, embed_dim: int = 16, output_dim: int = 2):
        self.input_dim = input_dim
        self.embed_dim = embed_dim
        self.output_dim = output_dim

        np.random.seed(42)
        # Embedding projection
        self.W_proj = np.random.randn(embed_dim, input_dim) * 0.1
        self.b_proj = np.zeros((embed_dim, 1))

        # Query, Key, Value weights
        self.W_q = np.random.randn(embed_dim, embed_dim) * 0.1
        self.W_k = np.random.randn(embed_dim, embed_dim) * 0.1
        self.W_v = np.random.randn(embed_dim, embed_dim) * 0.1

        # Feed Forward & Output projection
        self.W_fc = np.random.randn(output_dim, embed_dim) * 0.1
        self.b_fc = np.zeros((output_dim, 1))

    def forward(self, x: Any) -> Any:
        batch_size, seq_len, _ = x.shape
        outputs = []

        for b in range(batch_size):
            # Sequence: shape (seq_len, input_dim)
            seq = x[b]
            # Embed sequence: shape (seq_len, embed_dim)
            embedded = np.dot(seq, self.W_proj.T) + self.b_proj.T
            
            # Compute Queries, Keys, Values
            Q = np.dot(embedded, self.W_q.T) # (seq_len, embed_dim)
            K = np.dot(embedded, self.W_k.T) # (seq_len, embed_dim)
            V = np.dot(embedded, self.W_v.T) # (seq_len, embed_dim)
            
            # Scaled Dot-Product Attention: Softmax(Q K^T / sqrt(d_k)) * V
            scores = np.dot(Q, K.T) / math.sqrt(self.embed_dim)
            # Softmax row-wise
            exp_scores = np.exp(scores - np.max(scores, axis=-1, keepdims=True))
            attn_weights = exp_scores / np.sum(exp_scores, axis=-1, keepdims=True)
            
            attn_out = np.dot(attn_weights, V) # (seq_len, embed_dim)
            # Take last element as temporal context representation
            last_feat = attn_out[-1, :]
            
            # Classifier
            logits = np.dot(self.W_fc, last_feat) + self.b_fc.squeeze()
            exp_logits = np.exp(logits - np.max(logits))
            probs = exp_logits / np.sum(exp_logits)
            outputs.append(probs)

        return np.array(outputs)


# ==========================================
# 3. BENCHMARK COMPARATOR & PIPELINE BINDER
# ==========================================
class TemporalPredictionEngine:
    """
    Exposes classification routes for possession tracking
    and executes comparative benchmarking.
    """
    def __init__(self):
        self.device = "cuda" if (TORCH_AVAILABLE and torch.cuda.is_available()) else "cpu"
        
        # Initialize active models
        if TORCH_AVAILABLE:
            self.lstm = PyTorchLSTMModel().to(self.device)
            self.transformer = PyTorchTransformerModel().to(self.device)
            self.lstm.eval()
            self.transformer.eval()
            print(f"[Temporal AI] Loaded PyTorch models on {self.device}")
        else:
            self.lstm = NumpyLSTMModel()
            self.transformer = NumpyTransformerModel()
            print("[Temporal AI] Loaded NumPy matrix-propagation fallbacks")

    def run_inference(self, sequence_data: List[List[float]]) -> Dict[str, Any]:
        """
        Runs possession/win forecast models and profiles latency.
        sequence_data should be of shape: (1, seq_len, 5)
        Metrics in each state step: [Team_A_Possession, xG_diff, WeatherFatigue, CardCountDiff, PassAccuracy]
        """
        # Set up default dummy sequence if input shape is invalid
        seq_len = len(sequence_data)
        if seq_len == 0:
            sequence_data = [[0.5, 0.0, 1.0, 0, 0.9] for _ in range(10)]
            seq_len = 10
            
        # Ensure input dimensions
        if NUMPY_AVAILABLE:
            x_arr = np.array([sequence_data], dtype=np.float32) # (1, seq_len, 5)
        else:
            return {"status": "ERROR", "message": "NumPy library missing"}

        # --- LSTM Benchmarking ---
        t0 = time.time()
        if TORCH_AVAILABLE:
            with torch.no_grad():
                x_tensor = torch.tensor(x_arr).to(self.device)
                out_lstm = self.lstm(x_tensor).cpu().numpy()[0]
        else:
            out_lstm = self.lstm.forward(x_arr)[0]
        lstm_latency = (time.time() - t0) * 1000 # ms

        # --- Transformer Benchmarking ---
        t1 = time.time()
        if TORCH_AVAILABLE:
            with torch.no_grad():
                x_tensor = torch.tensor(x_arr).to(self.device)
                out_trans = self.transformer(x_tensor).cpu().numpy()[0]
        else:
            out_trans = self.transformer.forward(x_arr)[0]
        trans_latency = (time.time() - t1) * 1000 # ms

        return {
            "lstm_projection": {
                "win_probability_a": round(float(out_lstm[0]) * 100, 1),
                "win_probability_b": round(float(out_lstm[1]) * 100, 1),
                "latency_ms": round(lstm_latency, 3)
            },
            "transformer_projection": {
                "win_probability_a": round(float(out_trans[0]) * 100, 1),
                "win_probability_b": round(float(out_trans[1]) * 100, 1),
                "latency_ms": round(trans_latency, 3)
            },
            "framework": "PyTorch (GPU)" if (TORCH_AVAILABLE and self.device != "cpu") else "NumPy (CPU-bound)"
        }
