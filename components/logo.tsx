import Image from 'next/image';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ width = 40, height = 40, className = '' }) => {
  return (
    <Image
      src="/logo.svg"
      alt="Task Craft Logo"
      width={width}
      height={height}
      className={className}
    />
  );
};

export default Logo;

