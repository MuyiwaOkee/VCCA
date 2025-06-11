"use client"
import { VisaErrorTiny } from '@visa/nova-icons-react';
import { ChangeEvent, useRef, useState } from 'react';
import { Button, Input, InputContainer, InputMessage, Label, Utility } from '@visa/nova-react';

type Props = {
    id: string,
    label: string
    isRequired?: boolean,
    description?: string
    errorText: string
}

const DEFAULT_INPUT_STATE = {
  value: '',
  error: false,
};

export const ErrorInput = ({ id, label, isRequired, description, errorText }: Props) => {
  const [inputState, setInputState] = useState(DEFAULT_INPUT_STATE);

  const inputRef = useRef<HTMLInputElement>(null);

  // const handleSubmit = () => {
  //   // Customize this for your own validation needs
  //   setInputState(prevInputState => ({
  //     ...prevInputState,
  //     error: true,
  //   }));

  //   // Focus on the input with error
  //   if (inputRef.current) {
  //     inputRef.current.focus();
  //   }
  // };

  // const handleReset = () => {
  //   setInputState(DEFAULT_INPUT_STATE);
  // };

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
            aria-invalid={inputState.error}
            aria-required="true"
            ref={inputRef}
            id={id}
            type="text"
            value={inputState.value}
            onChange={handleInputChange}
          />
        </InputContainer>
        {inputState.error && (
          <InputMessage aria-atomic="true" aria-live="assertive" id={`${id}-message`} role="alert">
            <VisaErrorTiny />
            {errorText}
          </InputMessage>
        )}
        {description && !inputState.error && <InputMessage id={`${id}-message`}>{description}</InputMessage>}
      </Utility>
  );
};