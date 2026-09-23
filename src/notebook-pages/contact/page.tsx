import Companion from '@/components/characters/Companion';
import ContactActions from '@/components/notebook/ContactActions';
export const metadata = {
  title: 'Contact Mahesh',
  description:
    'Connect with Mahesh Reddy by email, GitHub, LinkedIn, or the Through My Eyes AI/ML blog.',
  alternates: { canonical: '/contact' },
};
export default function Contact() {
  return (
    <div className="page contact-page">
      <header className="page-heading">
        <div>
          <span className="kicker">THE LAST PAGE / THE NEXT CONVERSATION</span>
          <h1>
            Want to build <span className="hand">something?</span>
          </h1>
          <p>
            An interesting AI problem, a research question, or an idea worth
            exploring. I’d like to hear it.
          </p>
        </div>
        <Companion kind="dog" />
      </header>
      <div className="letter">
        <span className="hand">Dear fellow curious person,</span>
        <p>
          My notebook covers transformers, machine learning, computer vision,
          and responsible AI systems. If something here sparked a thought, let’s
          talk.
        </p>
        <a className="email-address" href="mailto:maheshreddygit@gmail.com">
          maheshreddygit@gmail.com
        </a>
        <ContactActions />
        <span className="hand signature">— Mahesh</span>
        <span className="letter-stamp" aria-hidden="true">
          INDIA
          <br />✳<br />
          AIR MAIL
        </span>
      </div>
      <div className="contact-links">
        {[
          [
            'GitHub',
            'The code & the experiments',
            'https://github.com/MaheshReddy-ML',
          ],
          [
            'LinkedIn',
            'The professional chapter',
            'https://linkedin.com/in/maheshreddy04',
          ],
          [
            'Technical blog',
            'Through My Eyes · AI/ML',
            'https://throughmyeyesaiml.blogspot.com',
          ],
          [
            'Portfolio',
            'My existing portfolio',
            'https://maheshreddyml.netlify.app',
          ],
        ].map(([name, desc, href]) => (
          <a href={href} key={name} target="_blank" rel="noreferrer">
            <h2>
              {name}
              <span>↗</span>
            </h2>
            <p>{desc}</p>
          </a>
        ))}
      </div>
      <div className="contact-signoff hand">
        Thanks for stopping by my little corner of the internet. ♡
      </div>
    </div>
  );
}
