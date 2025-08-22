import Link from 'next/link';

const Button = ({ text, linkStyles, buttonStyles, link = "#" }: { text: string, linkStyles: string, buttonStyles: string, link?: string }) => (
  <Link href={link} className={linkStyles}>
    <button className={buttonStyles}>
      {text}
    </button>
  </Link>
);

export default Button;