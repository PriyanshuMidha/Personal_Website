import { motion } from "framer-motion";

const SectionHeader = ({ eyebrow, title, description, actions }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
  >
    <div className="space-y-2">
      {eyebrow ? <p className="text-label">{eyebrow}</p> : null}
      <h2 className="font-display text-3xl tracking-tight text-text-primary md:text-4xl">{title}</h2>
      {description ? <p className="max-w-2xl text-sm leading-7 text-text-secondary md:text-base">{description}</p> : null}
    </div>
    {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
  </motion.div>
);

export default SectionHeader;
