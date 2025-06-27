"use client"
import { VisaChevronDownTiny, VisaChevronUpTiny, VisaClearAltTiny } from '@visa/nova-icons-react';
import {
  Button,
  Checkbox,
  Chip,
  Combobox,
  DropdownContainer,
  Input,
  InputContainer,
  Label,
  Listbox,
  ListboxContainer,
  ListboxItem,
  Utility,
  UtilityFragment,
} from '@visa/nova-react';
import { UseComboboxState, UseComboboxStateChangeOptions, useCombobox, useMultipleSelection } from 'downshift';
import { forwardRef, useState, useImperativeHandle } from 'react';

export type MultiselectItem = { value: string, strokeColor: string, fill: string };

export type MultiselectWithMultipleSelectionsAndVerticalScrollProps = {
    label: string,
    isRequired?: boolean,
    items: MultiselectItem[],
    id: string,
    defaultSelectedItems?: MultiselectItem[]
}

export type MultiselectRef = {
  selectedItems: MultiselectItem[];
  isOpen: boolean
} | null;

export const itemToString = (item: MultiselectItem | null) => (item ? item.value : '');

export const comboboxStateReducer = <ItemType,>(
  state: UseComboboxState<ItemType>,
  { type, changes }: UseComboboxStateChangeOptions<ItemType>
) => {
  switch (type) {
    case useCombobox.stateChangeTypes.InputClick:
      return {
        ...state,
      };
    case useCombobox.stateChangeTypes.InputChange:
      return {
        ...changes,
        highlightedIndex: state.highlightedIndex,
      };
    case useCombobox.stateChangeTypes.ItemMouseMove:
    case useCombobox.stateChangeTypes.MenuMouseLeave:
      return {
        ...changes,
        highlightedIndex: state.highlightedIndex,
      };
    case useCombobox.stateChangeTypes.InputKeyDownEnter:
    case useCombobox.stateChangeTypes.ItemClick:
      return {
        ...changes,
        isOpen: true,
        ...(changes.selectedItem && { highlightedIndex: state.highlightedIndex }),
      };
    default:
      return changes;
  }
};

export const MultiselectWithMultipleSelectionsAndVerticalScroll = forwardRef<MultiselectRef, MultiselectWithMultipleSelectionsAndVerticalScrollProps>(
  ({ items, label, isRequired = false, id, defaultSelectedItems }, ref) => {
    const [inputValue, setInputValue] = useState('');
    const [selectedItems, setSelectedItems] = useState<MultiselectItem[]>(defaultSelectedItems || items.slice(0, 1));

    const { getDropdownProps, removeSelectedItem } = useMultipleSelection({
      selectedItems,
      onStateChange({ selectedItems: newSelectedItems, type }) {
        if (
          type === useMultipleSelection.stateChangeTypes.SelectedItemKeyDownBackspace ||
          type === useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete ||
          type === useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace ||
          type === useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem
        ) {
          setSelectedItems(newSelectedItems!);
        }
      },
    });
    
    const {
      getToggleButtonProps,
      getLabelProps,
      getMenuProps,
      getInputProps,
      getItemProps,
      highlightedIndex,
      isOpen,
      setHighlightedIndex,
    } = useCombobox({
      items,
      itemToString,
      inputValue,
      stateReducer: comboboxStateReducer,
      onStateChange({ inputValue: newInputValue, type, selectedItem }) {
        if (type === useCombobox.stateChangeTypes.InputChange) {
          setInputValue(newInputValue!);
        }
        if (type === useCombobox.stateChangeTypes.ItemClick && !!selectedItem) {
          setHighlightedIndex(items.indexOf(selectedItem));
        }
      },
    });

    // Expose selectedItems via ref
    useImperativeHandle(ref, () => ({ selectedItems, isOpen }), [selectedItems, isOpen]);

    return (
      <Combobox style={{ maxInlineSize: '290px' }}>
        <UtilityFragment vFlex vFlexCol vGap={4}>
          <DropdownContainer>
            <Label {...getLabelProps()}>{label} {isRequired && '(required)'}</Label>
            <UtilityFragment vPaddingVertical={3} vPaddingLeft={3} vPaddingRight={6}>
              <InputContainer>
                <Utility
                  vFlex
                  vFlexGrow
                  vFlexShrink
                  vFlexWrap
                  vGap={2}
                  style={{ maxBlockSize: '70px', overflowY: 'auto' }}
                >
                  {selectedItems.map((item, index) => (
                    <UtilityFragment vFlexShrink0 key={`selected-item-${index}`}>
                      <Chip chipSize="compact">
                        <Label>{item.value}</Label>
                        <Button
                          aria-label={`Remove ${item.value}`}
                          colorScheme="tertiary"
                          iconButton
                          onClick={() => removeSelectedItem(item)}
                          subtle
                        >
                          <VisaClearAltTiny />
                        </Button>
                      </Chip>
                    </UtilityFragment>
                  ))}
                  <UtilityFragment vFlexShrink style={{ flexBasis: '50px' }}>
                    <Input
                      name={id}
                      {...getInputProps(
                        getDropdownProps({
                          onKeyDown: e => {
                            if (e.key === 'Enter') {
                              if (highlightedIndex !== -1 && isOpen) {
                                const selectedItem = items[highlightedIndex];
                                if (selectedItems.includes(selectedItem)) {
                                  removeSelectedItem(selectedItem);
                                } else {
                                  setSelectedItems([...selectedItems, selectedItem]);
                                  setInputValue('');
                                }
                              }
                            }
                          },
                        })
                      )}
                    />
                  </UtilityFragment>
                </Utility>
                <Button
                  aria-haspopup="listbox"
                  aria-label={`${id}-toggle-button`}
                  buttonSize="small"
                  colorScheme="tertiary"
                  iconButton
                  {...getToggleButtonProps()}
                >
                  {isOpen ? <VisaChevronUpTiny /> : <VisaChevronDownTiny />}
                </Button>
              </InputContainer>
            </UtilityFragment>
          </DropdownContainer>
        </UtilityFragment>
        <ListboxContainer>
          <UtilityFragment vFlex>
            <Listbox scroll {...getMenuProps()}>
              {items.map((item, index) => (
                <ListboxItem<HTMLLIElement>
                  key={`${id}-example-${index}`}
                  className={highlightedIndex === index ? 'v-listbox-item-highlighted' : ''}
                  {...getItemProps({
                    item,
                    index,
                    'aria-selected': selectedItems.includes(item),
                    onClick: () => {
                      if (selectedItems.includes(item)) {
                        removeSelectedItem(item);
                      } else {
                        setSelectedItems([...selectedItems, item]);
                        setInputValue('');
                      }
                    },
                  })}
                >
                  <Checkbox tag="span" />
                  {item.value}
                </ListboxItem>
              ))}
            </Listbox>
          </UtilityFragment>
        </ListboxContainer>
      </Combobox>
    );
  }
);

MultiselectWithMultipleSelectionsAndVerticalScroll.displayName = 'MultiselectWithMultipleSelectionsAndVerticalScroll';