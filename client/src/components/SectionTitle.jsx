import SectionHeader from "./SectionHeader";

const SectionTitle = ({ eyebrow = "Portfolio", title, description }) => (
  <SectionHeader eyebrow={eyebrow} title={title} description={description} />
);

export default SectionTitle;
