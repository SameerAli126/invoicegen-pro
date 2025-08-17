import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'md'
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-soft',
    lg: 'shadow-large'
  };
  
  const classes = `
    bg-white rounded-xl border border-secondary-100 
    ${paddingClasses[padding]} 
    ${shadowClasses[shadow]} 
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export default Card;
