'use client';

import React from 'react';
import { useStore } from '../../stores/useStore';
import styled from 'styled-components';

const CounterContainer = styled.div`
  text-align: center;
  margin: 20px;
`;

const CounterButton = styled.button`
  padding: 10px;
  background-color: ${({ theme }) => theme.primary};
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const Counter: React.FC = () => {
  const { count, increment } = useStore();

  return (
    <CounterContainer>
      <h1>{count}</h1>
      <CounterButton onClick={increment}>Increment</CounterButton>
    </CounterContainer>
  );
};

export default Counter;
