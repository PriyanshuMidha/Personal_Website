import { Link } from "react-router-dom";

const QuickActionCard = ({ title, description, href, external = false, accent = "purple" }) => {
  const accentClasses = {
    purple: "border-accent-primary/30 hover:border-accent-primary/60",
    green: "border-accent-green/30 hover:border-accent-green/60",
    cyan: "border-accent-cyan/30 hover:border-accent-cyan/60",
    yellow: "border-accent-yellow/30 hover:border-accent-yellow/60",
  };

  const sharedClassName = `card-interactive block p-5 ${accentClasses[accent] || accentClasses.purple}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={sharedClassName}>
        <p className="text-sm font-semibold text-text-primary">{title}</p>
        <p className="mt-2 text-sm leading-7 text-text-secondary">{description}</p>
      </a>
    );
  }

  return (
    <Link to={href} className={sharedClassName}>
      <p className="text-sm font-semibold text-text-primary">{title}</p>
      <p className="mt-2 text-sm leading-7 text-text-secondary">{description}</p>
    </Link>
  );
};

export default QuickActionCard;
