import Link from 'next/link';
import PropTypes from 'prop-types';

const Button = ({ text, linkStyles, buttonStyles, link = "#" }: { text: string, linkStyles: string, buttonStyles: string, link?: string }) => (
  <Link href={link} className={linkStyles}>
    <button className={buttonStyles}>
      {text}
    </button>
  </Link>
);

Button.propTypes = {
  text: PropTypes.string.isRequired,
  linkStyles: PropTypes.string.isRequired,
  buttonStyles: PropTypes.string.isRequired,
  link: PropTypes.string,
};

export default Button;