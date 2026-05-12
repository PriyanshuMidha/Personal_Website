import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import TechBadge from "./TechBadge";

const ProjectCard = ({ project }) => (
  <motion.article
    whileHover={{ y: -6 }}
    className="card-interactive flex h-full flex-col justify-between p-6"
  >
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-label">{project.category || "Project"}</p>
        <div className="flex items-center gap-2">
          {project.isFeatured ? <StatusBadge tone="primary">Featured</StatusBadge> : null}
          <StatusBadge status={project.status || "completed"} />
        </div>
      </div>
      <div>
        <h3 className="font-display text-2xl text-text-primary">{project.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-text-secondary">{project.shortDescription}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {(project.techStack || []).slice(0, 4).map((item) => (
          <TechBadge key={item}>{item}</TechBadge>
        ))}
      </div>
    </div>
    <div className="mt-8 flex items-center justify-between">
      <Link to={`/projects/${project.slug}`} className="text-sm font-semibold text-text-primary hover:text-accent-primary">
        View details
      </Link>
      <div className="flex items-center gap-3">
        {project.githubUrl ? (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-text-secondary hover:text-text-primary">
            GitHub
          </a>
        ) : null}
        {project.liveUrl ? (
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-accent-cyan hover:text-text-primary">
            Live
          </a>
        ) : null}
      </div>
    </div>
  </motion.article>
);

export default ProjectCard;
