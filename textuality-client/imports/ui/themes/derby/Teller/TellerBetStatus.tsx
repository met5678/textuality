import React from 'react';
import './Teller.css';
import { TellerWithHelpers } from '/imports/api/themes/derby/tellers/tellers';
import { RaceBetWithHelpers } from '/imports/api/themes/derby/raceBets/raceBets';

import { LedRound } from '../modules/LedLights/LedRound';
import {
  TELLER_AVAILABLE_STATUSES,
  TellerStatus as TellerStatusType,
} from '/imports/schemas/derby/teller-status/teller-status';

const ledSize = 68;

export const TellerBetStatus = ({
  teller,
  raceBet,
}: {
  teller: TellerWithHelpers;
  raceBet: RaceBetWithHelpers;
}) => {
  const status = teller.status as TellerStatusType;
  const isAvailable = TELLER_AVAILABLE_STATUSES.includes(status);

  const STEP_1 = ['bet-type'];
  const STEP_2 = ['horse1', 'horse2', 'horse3'];
  const STEP_3 = ['wager'];
  const STEP_4 = ['complete'];

  console.log(raceBet);

  return (
    <div className="teller-bet-status">
      <LedRound
        off={!isAvailable}
        size={ledSize}
        icon={
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g transform="matrix(0.120834,-0.0320014,0.0320014,0.120834,-3.56296,4.6294)">
              <path d="M87.923,48L87.923,208L32,208C23.223,208 16,200.777 16,192L16,160C16,155.611 19.611,152 24,152C37.166,152 48,141.166 48,128C48,114.834 37.166,104 24,104C19.611,104 16,100.389 16,96L16,64C16,55.223 23.223,48 32,48L87.923,48ZM95.692,208L95.692,48L224,48C232.777,48 240,55.223 240,64L240,96C240,100.389 236.389,104 232,104C218.834,104 208,114.834 208,128C208,141.166 218.834,152 232,152C236.389,152 240,155.611 240,160L240,192C240,200.777 232.777,208 224,208L95.692,208Z" />
            </g>
          </svg>
        }
      />
      <LedRound
        off={!isAvailable}
        size={ledSize}
        icon={
          <svg
            style={{
              position: 'relative',
              width: '88%',
              height: '88%',
              top: '6%',
              left: '6%',
            }}
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g transform="matrix(1.5989,0,0,1.5989,-3.18178,-3.18679)">
              <path d="M13.692,12.389L14.622,20.932C14.646,21.151 14.553,21.365 14.378,21.498C14.203,21.631 13.972,21.662 13.768,21.581L3.768,17.581C3.5,17.474 3.34,17.197 3.381,16.912L4.531,8.851C5.065,5.133 8.249,2.375 12,2.375L20,2.375C20.231,2.375 20.443,2.502 20.551,2.705C20.66,2.908 20.648,3.155 20.52,3.347L19.285,5.199C20.103,5.863 20.625,6.866 20.625,8L20.625,16C20.625,16.269 20.453,16.508 20.198,16.593L17.198,17.593C16.913,17.688 16.602,17.568 16.455,17.306L13.692,12.389Z" />
            </g>
          </svg>
        }
      />
      <LedRound
        off={!isAvailable}
        size={ledSize}
        icon={
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g transform="matrix(1.61111,0,0,1.61111,-3.33333,-3.33333)">
              <path d="M7,14.379L9,14.379C9.343,14.379 9.621,14.657 9.621,15C9.621,15.266 9.777,15.506 10.003,15.71C10.458,16.121 11.193,16.379 12,16.379C12.807,16.379 13.542,16.121 13.997,15.71C14.223,15.506 14.379,15.266 14.379,15C14.379,14.684 14.206,14.485 13.899,14.311C13.399,14.028 12.641,13.821 11.615,13.573L11.609,13.572C10.489,13.292 9.234,12.967 8.256,12.355C7.159,11.669 6.379,10.648 6.379,9C6.379,7.088 7.803,5.409 9.879,4.715L9.879,3C9.879,2.657 10.157,2.379 10.5,2.379L13.5,2.379C13.843,2.379 14.121,2.657 14.121,3L14.121,4.715C16.197,5.409 17.621,7.088 17.621,9C17.621,9.343 17.343,9.621 17,9.621L15,9.621C14.657,9.621 14.379,9.343 14.379,9C14.379,8.734 14.223,8.494 13.997,8.29C13.542,7.879 12.807,7.621 12,7.621C11.193,7.621 10.458,7.879 10.003,8.29C9.777,8.494 9.621,8.734 9.621,9C9.621,9.316 9.794,9.515 10.101,9.689C10.601,9.972 11.359,10.179 12.385,10.427L12.391,10.428C13.511,10.708 14.766,11.033 15.744,11.645C16.841,12.331 17.621,13.352 17.621,15C17.621,16.912 16.197,18.591 14.121,19.285L14.121,21C14.121,21.343 13.843,21.621 13.5,21.621L10.5,21.621C10.157,21.621 9.879,21.343 9.879,21L9.879,19.285C7.803,18.591 6.379,16.912 6.379,15C6.379,14.657 6.657,14.379 7,14.379Z" />
            </g>
          </svg>
        }
      />
    </div>
  );
};
