import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { closeReportModal, submitInspectionReport } from '../../store/slices/mechanicSlice';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '../common/Button';

const ScoreSlider = ({ label, value, onChange }) => {
  // Determine color based on score
  const getColor = (v) => {
    if (v < 50) return 'bg-nothing-red';
    if (v < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <label className="text-xs font-mono uppercase tracking-widest text-neutral-400">{label}</label>
        <span className="font-mono text-sm">{value}/100</span>
      </div>
      <div className="relative h-2 bg-nothing-black rounded-full overflow-hidden border border-nothing-gray group">
        <motion.div
          className={`absolute top-0 left-0 h-full ${getColor(value)}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
        />
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
};

const ReportModal = () => {
  const dispatch = useDispatch();
  const { activeJobs, selectedRequestId } = useSelector((state) => state.mechanic);
  const job = activeJobs.find(r => r.id === selectedRequestId);

  const [scores, setScores] = useState({
    engine: 85,
    brakes: 70,
    suspension: 75,
    tires: 80,
    electrical: 90
  });

  const [notes, setNotes] = useState('');

  if (!job) return null;

  const handleSubmit = () => {
    dispatch(submitInspectionReport({
      id: job.id,
      report: {
        scores: {
          engine: scores.engine,
          brakes: scores.brakes,
          suspension: scores.suspension,
          tires: scores.tires,
          electrical: scores.electrical
        },
        overallComment: notes
      }
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={() => dispatch(closeReportModal())}
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        className="relative bg-nothing-dark border border-nothing-gray w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-nothing-gray flex justify-between items-center bg-nothing-black/50">
          <div>
            <h2 className="text-xl font-medium tracking-tight">Final Inspection Report.</h2>
            <p className="text-sm text-neutral-400 font-mono">Job ID: {job.id.substring(0, 8).toUpperCase()}</p>
          </div>
          <button
            onClick={() => dispatch(closeReportModal())}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={20} className="text-neutral-400" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-8 custom-scrollbar">

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Component Scores</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Adjust the sliders based on your technical assessment. 100 means the part is in factory condition.
            </p>
          </div>

          <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-nothing-gray">
            <ScoreSlider label="Engine & Transmission" value={scores.engine} onChange={(v) => setScores(p => ({ ...p, engine: v }))} />
            <ScoreSlider label="Braking System" value={scores.brakes} onChange={(v) => setScores(p => ({ ...p, brakes: v }))} />
            <ScoreSlider label="Suspension & Forks" value={scores.suspension} onChange={(v) => setScores(p => ({ ...p, suspension: v }))} />
            <ScoreSlider label="Tires & Wheels" value={scores.tires} onChange={(v) => setScores(p => ({ ...p, tires: v }))} />
            <ScoreSlider label="Electricals & Battery" value={scores.electrical} onChange={(v) => setScores(p => ({ ...p, electrical: v }))} />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label className="text-xs font-mono uppercase text-neutral-500 tracking-widest ml-1">
              Overall Comment
            </label>
            <textarea
              rows={4}
              className="w-full bg-nothing-black border border-nothing-gray rounded-xl p-4 text-white placeholder-neutral-600 outline-none focus:border-nothing-white transition-colors resize-none"
              placeholder="Overall summary of the bike's condition..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-nothing-red/10 border border-nothing-red/20 text-nothing-red">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-xs">Submitting this report will mark the job as complete and generate the certificate for the buyer.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-nothing-gray bg-nothing-dark flex justify-end gap-4">
          <Button onClick={handleSubmit} withArrow className="py-3 px-6 text-sm">
            Submit Report
          </Button>
        </div>

      </motion.div>
    </div>
  );
};

export default ReportModal;