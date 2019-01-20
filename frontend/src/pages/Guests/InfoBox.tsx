import React from 'react';
// Styled Components
import { InfoDiv } from './Guests.styling';
// Styles
import styled from '@emotion/styled';

export const InfoBox = (props: {
  main: string;
  secondary: string;
  className?: string;
}) => {
  const { main, secondary, className } = props;

  return (
    <InfoDiv className={className}>
      <div className='text-main'>{main}</div>
      <div className='text-secondary'>{secondary}</div>
    </InfoDiv>
  );
};
