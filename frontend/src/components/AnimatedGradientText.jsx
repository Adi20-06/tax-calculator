export default function AnimatedGradientText({ children, as: Tag = 'span' }) {
  return <Tag className="gradient-text">{children}</Tag>;
}