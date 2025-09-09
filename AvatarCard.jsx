import { Avatar, AvatarGroup, Stack, Box } from '@mui/material';
import React from 'react';
import { transformImage } from '../../libs/Features';

const AvatarCard = ({ avatar = [], max = 3 }) => {
  // Flatten the array of arrays into a single array
  const flattenedAvatars = avatar.flat();
  
  const boxwidth = `${4 + 0.5*flattenedAvatars.length}rem`

  return (
    <Stack direction={'row'} spacing={0.5}>
      <AvatarGroup max={max}>
        <Box width={boxwidth} height={'3rem'}>
          {flattenedAvatars.length > 0 && flattenedAvatars.map((item, index) => (
            <Avatar
              src={transformImage(item?.url, 100)} // Use item.url directly
              key={index} // Use a unique identifier
              alt={`Avatar ${index}`}
              sx={{
                width: '3rem',
                height: '3rem',
                border: '2px solid white',
                position: 'absolute',
                left: { xs: `${index + 0.3}rem`, sm: `${index + 0.7}rem` },
              }}
            />
          ))}
        </Box>
      </AvatarGroup>
    </Stack>
  );
};

export default AvatarCard;
