import { styled } from '@linaria/react';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';

import { LightCopyIconButton } from '@/object-record/record-field/ui/components/LightCopyIconButton';
import { useRegisterInputEvents } from '@/object-record/record-field/ui/meta-types/input/hooks/useRegisterInputEvents';
import { turnIntoEmptyStringIfWhitespacesOnly } from '~/utils/string/turnIntoEmptyStringIfWhitespacesOnly';
import { themeCssVariables } from 'twenty-ui/theme';

export const StyledTextInput = styled.input`
  background-color: transparent;
  border: none;
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: inherit;
  font-weight: inherit;
  margin: 0;
  outline: none;
  padding: ${themeCssVariables.spacing[0]} ${themeCssVariables.spacing[2]};

  &::placeholder,
  &::-webkit-input-placeholder {
    color: ${themeCssVariables.font.color.light};
    font-family: ${themeCssVariables.font.family};
    font-weight: ${themeCssVariables.font.weight.medium};
  }

  width: 100%;

  &:disabled {
    color: ${themeCssVariables.font.color.tertiary};
  }
`;

export type TextInputProps = {
  instanceId: string;
  placeholder?: string;
  autoFocus?: boolean;
  selectOnFocus?: boolean;
  value: string;
  onEnter?: (newText: string) => void;
  onEscape?: (newText: string) => void;
  onTab?: (newText: string) => void;
  onShiftTab?: (newText: string) => void;
  onClickOutside?: (event: MouseEvent | TouchEvent, inputValue: string) => void;
  onChange?: (newText: string) => void;
  copyButton?: boolean;
  disabled?: boolean;
  className?: string;
};

export const TextInput = ({
  instanceId,
  placeholder,
  autoFocus,
  selectOnFocus = false,
  value,
  onEnter,
  onEscape,
  onTab,
  onShiftTab,
  onClickOutside,
  onChange,
  copyButton = true,
  disabled,
  className,
}: TextInputProps) => {
  const [internalText, setInternalText] = useState(value);

  const wrapperRef = useRef<HTMLInputElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  // Trimming here would eat the spaces as they are typed: this input is
  // controlled, so the trimmed value is pushed back into the DOM on each keystroke
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const targetValue = turnIntoEmptyStringIfWhitespacesOnly(
      event.target.value,
    );
    setInternalText(targetValue);
    onChange?.(targetValue);
  };
  useEffect(() => {
    setInternalText(turnIntoEmptyStringIfWhitespacesOnly(value));
  }, [value]);

  useRegisterInputEvents({
    focusId: instanceId,
    inputRef: wrapperRef,
    copyRef: copyRef,
    inputValue: internalText,
    onEnter,
    onEscape,
    onClickOutside,
    onTab,
    onShiftTab,
  });

  return (
    <>
      <StyledTextInput
        id={instanceId}
        autoComplete="off"
        ref={wrapperRef}
        placeholder={placeholder}
        onChange={handleChange}
        autoFocus={autoFocus}
        onFocus={
          selectOnFocus ? (event) => event.currentTarget.select() : undefined
        }
        value={internalText}
        disabled={disabled}
        className={className}
      />
      {copyButton && (
        <div ref={copyRef}>
          <LightCopyIconButton copyText={internalText} />
        </div>
      )}
    </>
  );
};
