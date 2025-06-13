"use client"
import { VisaErrorTiny } from '@visa/nova-icons-react';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Input, InputContainer, InputMessage, Label, Utility } from '@visa/nova-react';

type Props = {
    id: string,
    label: string
    isRequired?: boolean,
    description?: string
    errorText: string | undefined,
    autocomplete?: string
}

const DEFAULT_INPUT_STATE = {
  value: '',
  error: false,
};

export const ErrorInput = ({ id, label, isRequired, description, errorText, autocomplete }: Props) => {
  const [inputState, setInputState] = useState(DEFAULT_INPUT_STATE);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputState({
      value: e.target.value,
      error: false,
    });
  };
  
  return (
      <Utility vFlex vFlexCol vGap={4} className='w-full'>
        <Label htmlFor={id}>{label} {isRequired ? "(required)" : ""}</Label>
        <InputContainer>
          <Input
            aria-describedby={`${id}-message`}
            aria-invalid={errorText ? 'true' : 'false'}
            aria-required="true"
            ref={inputRef}
            id={id}
            type="text"
            name={id}
            value={inputState.value}
            onChange={handleInputChange}
            autoComplete={autocomplete}
          />
        </InputContainer>
        {errorText && (
          <InputMessage aria-atomic="true" aria-live="assertive" id={`${id}-message`} role="alert">
            <VisaErrorTiny />
            {errorText}
          </InputMessage>
        )}
        {description && !errorText && <InputMessage id={`${id}-message`}>{description}</InputMessage>}
      </Utility>
  );
};