import SkillLab from '@/components/notebook/SkillLab';
export const metadata = {
  title: 'Technical Skills · The AI Lab',
  description:
    'The programming languages, ML tools, architectures, deployment technologies, and research areas in Mahesh Reddy’s résumé.',
  alternates: { canonical: '/skills' },
};
export default function Skills() {
  return (
    <div className="page">
      <header className="page-heading">
        <div>
          <span className="kicker">THE TOOL SHELF / TECHNICAL SKILLS</span>
          <h1>
            Inside my <span className="hand">AI laboratory.</span>
          </h1>
          <p>
            From the first gradient to the API response.
            <br />
            Explore a tool to find a project where it belongs.
          </p>
        </div>
      </header>
      <SkillLab />
    </div>
  );
}
