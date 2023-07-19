'use client'

import { Button, Flex, Text } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

export type PaginationProps = {
  max: number;
  current: number;
  onNext: () => void;
  onPrev: () => void;
  onClick: (page: number) => void;
};

export default function Pagination({
  max,
  current,
  onNext,
  onPrev,
  onClick,
}: PaginationProps) {
  return (
    <Flex direction="row" align="center" gap="3" overflowX="scroll">
      <Button variant="ghost" isDisabled={current === 1} onClick={onPrev}>
        <ChevronLeftIcon boxSize={6} color="orange.900" />
      </Button>
      {Array.from({ length: max }, (_, index) => index + 1).map((index) => (
        <Button
          key={index}
          variant="ghost"
          isDisabled={current === index}
          onClick={() => onClick(index)}
        >
          <Text size="md" fontWeight={current === index ? 'bold' : 'normal'}>
            {index}
          </Text>
        </Button>
      ))}
      <Button variant="ghost" isDisabled={current === max} onClick={onNext}>
        <ChevronRightIcon boxSize={6} color="orange.900" />
      </Button>
    </Flex>
  );
}
