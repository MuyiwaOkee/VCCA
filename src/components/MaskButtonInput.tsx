"use client"
import { VisaErrorTiny, VisaPasswordHideTiny, VisaPasswordShowTiny } from '@visa/nova-icons-react';
import { Button, Input, InputContainer, InputMessage, Label, Utility } from '@visa/nova-react';
import { useState } from 'react';

type Props = {
    id: string,
    label: string
    isRequired?: boolean,
    description?: string
    errorText: string | undefined,
    autocomplete?: string
}

export const MaskButtonInput = ({ id, label, isRequired, description, errorText, autocomplete }: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Utility vFlex vFlexCol vGap={4} className='w-full'>
      <Label htmlFor={id}>{label} {isRequired ? "(required)" : ""}</Label>
      <InputContainer>
        <Input aria-required="true" id={id}  name={id} type={showPassword ? 'text' : 'password'} autoComplete={autocomplete}/>
        <Button
          aria-label={showPassword ? 'hide text' : 'show text'}
          buttonSize="small"
          colorScheme="tertiary"
          iconButton
          onClick={() => setShowPassword(!showPassword)}
          type='button'
        >
          {showPassword ? <VisaPasswordHideTiny /> : <VisaPasswordShowTiny />}
        </Button>
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