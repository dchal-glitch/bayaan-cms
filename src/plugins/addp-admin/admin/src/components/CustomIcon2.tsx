import * as Tooltip from '@radix-ui/react-tooltip';
import { Typography } from "@strapi/design-system";
import React from 'react';

interface TooltipIconButtonProps {
  label: string;
  icon: React.ReactNode;
}

const TooltipIconButton = ({ label, icon }: TooltipIconButtonProps) => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              padding: '0',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              color: '#32324d',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f6f6f9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label={label}
          >
            {icon}
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content 
            sideOffset={5}
            style={{
              backgroundColor: '#212134',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              maxWidth: '200px',
              zIndex: 1000,
            }}
          >
            <Typography variant="pi" textColor="neutral0">
              {label}
            </Typography>
            <Tooltip.Arrow style={{ fill: '#212134' }} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default TooltipIconButton;


