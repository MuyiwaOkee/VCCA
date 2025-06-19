import { VisaChevronLeftTiny, VisaChevronRightTiny } from '@visa/nova-icons-react';
import { Button, Pagination } from '@visa/nova-react';

export const SlimPagination = () => {
  return (
    <nav aria-label="pagination">
      <Pagination className="v-flex v-flex-row v-align-items-center v-gap-4">
        <li>
          <Button aria-label="Go to previous page" buttonSize="small" colorScheme="tertiary" disabled iconButton>
            <VisaChevronLeftTiny rtl />
          </Button>
        </li>
        <li>
          <Button aria-current="true" aria-label="Page 1" colorScheme="tertiary">
            1
          </Button>
        </li>
        <li className="v-mobile-container-hide">
          <Button aria-label="Page 2" colorScheme="tertiary">
            2
          </Button>
        </li>
        <li className="v-mobile-container-hide">
          <Button aria-label="Page 3" colorScheme="tertiary">
            3
          </Button>
        </li>
        <li className="v-mobile-container-hide">
          <Button aria-label="Page 4" colorScheme="tertiary">
            4
          </Button>
        </li>
        <li>
          <Button aria-label="Go to next page" buttonSize="small" colorScheme="tertiary" iconButton>
            <VisaChevronRightTiny rtl />
          </Button>
        </li>
      </Pagination>
    </nav>
  );
};