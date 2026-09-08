'use client';

import React, { useState } from 'react';
import { useConnect } from '../ConnectContext';
import { 
  BarChart2, 
  CheckCircle2, 
  Vote, 
  Plus, 
  Users, 
  Clock, 
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function PollsView() {
  const { polls, votePoll, setIsModalOpen, setModalTab, currentUser } = useConnect();
  const [votingId, setVotingId] = useState(null);

  const handleVote = async (pollId, optionIndex) => {
    if (!currentUser || votingId) return;
    setVotingId(pollId);
    try {
      await votePoll(pollId, optionIndex);
    } finally {
      setVotingId(null);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-border/40">
        <div>
          <h2 className="text-xl font-display font-bold text-brand-text-main flex items-center gap-2.5">
            <BarChart2 className="w-6 h-6 text-brand-primary" />
            Active Polls & Governance Matrix
          </h2>
          <p className="text-xs text-brand-text-muted mt-1">
            Participate in real-time university consensus, student union voting, and academic initiatives.
          </p>
        </div>

        <button
          onClick={() => {
            setModalTab('poll');
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold font-display rounded-xl flex items-center gap-2 shadow-lg shadow-brand-primary/20 cursor-pointer self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          Launch Poll
        </button>
      </div>

      {/* Polls Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {polls.length > 0 ? (
          polls.map((poll) => {
            const options = Array.isArray(poll.options) ? poll.options : [];
            const votes = poll.votes || {};
            const votedUsers = Array.isArray(poll.voted_users) ? poll.voted_users : [];
            const hasVoted = currentUser && votedUsers.includes(currentUser.id);
            
            // Calculate total votes across all options
            let totalVotes = 0;
            options.forEach((_, idx) => {
              totalVotes += Number(votes[idx] || 0);
            });

            const createdDate = poll.created_at 
              ? new Date(poll.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })
              : 'Recent';

            return (
              <motion.div
                key={poll.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 sm:p-6 bg-white border border-slate-200/90 hover:border-indigo-300 rounded-3xl flex flex-col gap-4 shadow-2xs transition-all min-w-0"
              >
                {/* Question & Metadata */}
                <div className="flex items-start justify-between gap-3 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug min-w-0 flex-1 break-words">
                    {poll.question}
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10.5px] font-bold shrink-0 flex items-center gap-1.5 self-start whitespace-nowrap shadow-2xs">
                    <Vote className="w-3.5 h-3.5" />
                    <span>{totalVotes} {totalVotes === 1 ? 'Vote' : 'Votes'}</span>
                  </span>
                </div>

                {/* Options with live progress */}
                <div className="flex flex-col gap-2.5 min-w-0">
                  {options.map((optionText, idx) => {
                    const optVotes = Number(votes[idx] || 0);
                    const percentage = totalVotes > 0 ? Math.round((optVotes / totalVotes) * 100) : 0;

                    return (
                      <button
                        key={idx}
                        disabled={hasVoted || votingId === poll.id}
                        onClick={() => handleVote(poll.id, idx)}
                        className={`w-full relative p-3.5 px-4 rounded-2xl border text-left transition-all overflow-hidden flex flex-col gap-1 min-w-0 ${
                          hasVoted 
                            ? 'bg-slate-50/80 border-slate-200 cursor-default' 
                            : 'bg-white hover:bg-indigo-50/50 border-slate-200 hover:border-indigo-300 cursor-pointer shadow-2xs'
                        }`}
                      >
                        {/* Fill percentage background bar */}
                        {hasVoted && (
                          <div 
                            className="absolute left-0 top-0 bottom-0 bg-indigo-100/70 transition-all duration-500 rounded-2xl"
                            style={{ width: `${percentage}%` }}
                          />
                        )}

                        <div className="relative z-10 flex justify-between items-center text-xs sm:text-[13px] font-bold gap-2 min-w-0">
                          <span className="text-slate-800 break-words min-w-0 flex-1">{optionText}</span>
                          {hasVoted && (
                            <span className="text-xs font-bold text-indigo-700 shrink-0 font-mono ml-2 whitespace-nowrap">
                              {percentage}% ({optVotes})
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-500 min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="truncate font-medium">Launched: {createdDate}</span>
                  </div>

                  {hasVoted ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1.5 shrink-0 ml-2">
                      <CheckCircle2 className="w-4 h-4" /> Response Recorded
                    </span>
                  ) : (
                    <span className="text-slate-400 font-medium shrink-0 ml-2">Click option to vote</span>
                  )}
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-2 p-16 text-center bg-white border border-slate-200 rounded-2xl flex flex-col items-center gap-3 shadow-sm">
            <BarChart2 className="w-10 h-10 text-slate-400" />
            <span className="text-xs font-semibold text-slate-600">No active consensus polls currently open.</span>
            <button
              onClick={() => {
                setModalTab('poll');
                setIsModalOpen(true);
              }}
              className="mt-2 px-4 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold hover:bg-brand-primary hover:text-white transition-all cursor-pointer"
            >
              Launch the First Poll
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
