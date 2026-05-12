import { motion } from "framer-motion";
import StatusBadge from "./StatusBadge";

const accentClasses = {
  primary: "bg-accent-primary",
  green: "bg-accent-green",
  cyan: "bg-accent-cyan",
  yellow: "bg-accent-yellow",
  red: "bg-accent-red",
};

const MetricCard = ({ label, value, helper, accent = "primary", trend, action, progress = 0 }) => (
  <motion.div whileHover={{ y: -3 }} className="card-interactive p-5">
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-3">
        <p className="text-label">{label}</p>
        <p className="font-display text-3xl tracking-tight text-text-primary">{value}</p>
        {helper ? <p className="text-sm text-text-secondary">{helper}</p> : null}
      </div>
      {trend ? <StatusBadge tone={accent}>{trend}</StatusBadge> : null}
    </div>
    {progress ? (
      <div className="metric-strip">
        <div className={`h-full rounded-full ${accentClasses[accent] || accentClasses.primary}`} style={{ width: `${Math.max(8, Math.min(progress, 100))}%` }} />
      </div>
    ) : null}
    {action ? <div className="mt-5">{action}</div> : null}
  </motion.div>
);

export default MetricCard;
