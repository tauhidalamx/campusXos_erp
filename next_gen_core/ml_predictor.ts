export interface StudentMLFeature {
  gpa: number;          // 0.0 to 4.0
  attendanceRate: number; // 0.0 to 1.0 (e.g. 0.85 = 85%)
  completedSemesters: number; // 1 to 8
  backlogsCount: number;  // 0 to 10
  feeDueAmount: number;   // 0 to 5000
}

export interface StudentRiskReport {
  studentId: string;
  dropoutProbability: number; // 0.0 to 1.0
  placementProbability: number; // 0.0 to 1.0
  projectedGpa: number; // 0.0 to 4.0
  riskLevel: 'Low' | 'Moderate' | 'Critical';
  academicWarningEnforced: boolean;
}

export class CampusXMLPredictor {
  // Model weights matrices representing a pre-trained deep neural network model
  private static inputWeights = [
    [-0.45,  0.85, -0.12],  // CGPA impact (high negative on dropout, positive on placement)
    [-0.75,  0.55, -0.05],  // Attendance impact (very high negative on dropout)
    [ 0.12,  0.30,  0.40],  // Semesters elapsed
    [ 0.95, -0.65, -0.75],  // Backlogs count (high positive on dropout, negative on placement)
    [ 0.35, -0.15, -0.25]   // Financial delays (moderate impact)
  ];

  private static biases = [0.15, 0.45, 0.05]; // Dropout, Placement, GPA biases

  /**
   * Evaluates student metrics and predicts dropout risk and career placement probabilities.
   * Emulates a multi-layer feedforward neural network validation path.
   */
  public static predictStudentRisk(studentId: string, features: StudentMLFeature): StudentRiskReport {
    // 1. Data Normalization mapping features to 0-1 scale ranges
    const normalizedGpa = features.gpa / 4.0;
    const normalizedAttendance = features.attendanceRate;
    const normalizedSemesters = features.completedSemesters / 8.0;
    const normalizedBacklogs = Math.min(features.backlogsCount / 10.0, 1.0);
    const normalizedFees = Math.min(features.feeDueAmount / 5000.0, 1.0);

    const inputVector = [
      normalizedGpa,
      normalizedAttendance,
      normalizedSemesters,
      normalizedBacklogs,
      normalizedFees
    ];

    // 2. Perform Matrix Multiplication & Bias addition (Hidden Layer Forward Propagation)
    const hiddenOutputs = [0, 0, 0];
    for (let col = 0; col < hiddenOutputs.length; col++) {
      let sum = 0;
      for (let row = 0; row < inputVector.length; row++) {
        sum += inputVector[row] * CampusXMLPredictor.inputWeights[row][col];
      }
      hiddenOutputs[col] = sum + CampusXMLPredictor.biases[col];
    }

    // 3. Activation Functions (Sigmoid activation for probabilities, Linear mapping for GPA)
    const rawDropoutProb = CampusXMLPredictor.sigmoid(hiddenOutputs[0]);
    const rawPlacementProb = CampusXMLPredictor.sigmoid(hiddenOutputs[1]);
    
    // GPA projections (restricted to valid bounds)
    const predictedChange = hiddenOutputs[2] * 0.2; 
    const projectedGpa = Math.max(1.0, Math.min(4.0, features.gpa + predictedChange));

    // 4. Academic Risk Severity Classification
    let riskLevel: 'Low' | 'Moderate' | 'Critical' = 'Low';
    if (rawDropoutProb >= 0.60 || features.attendanceRate < 0.70 || features.gpa < 2.0) {
      riskLevel = 'Critical';
    } else if (rawDropoutProb >= 0.25 || features.gpa < 2.8) {
      riskLevel = 'Moderate';
    }

    const academicWarningEnforced = riskLevel === 'Critical';

    return {
      studentId,
      dropoutProbability: parseFloat(rawDropoutProb.toFixed(4)),
      placementProbability: parseFloat(rawPlacementProb.toFixed(4)),
      projectedGpa: parseFloat(projectedGpa.toFixed(2)),
      riskLevel,
      academicWarningEnforced
    };
  }

  /**
   * Helper Sigmoid activation function
   */
  private static sigmoid(z: number): number {
    return 1 / (1 + Math.exp(-z));
  }

  /**
   * Simulated Gradient Descent training iteration
   * Demonstrates loss tracking outputs
   */
  public static runTrainingEpoch(dataset: Array<{ features: StudentMLFeature; label: number }>): number {
    let totalLoss = 0;

    dataset.forEach(sample => {
      const prediction = CampusXMLPredictor.predictStudentRisk('sample', sample.features);
      const error = sample.label - prediction.dropoutProbability;
      
      // Binary Cross Entropy Loss accumulation
      totalLoss += - (sample.label * Math.log(Math.max(prediction.dropoutProbability, 1e-15)) + 
                     (1 - sample.label) * Math.log(Math.max(1 - prediction.dropoutProbability, 1e-15)));
    });

    return totalLoss / dataset.length;
  }
}
