import React, { ReactNode } from 'react';
import { Meteor } from 'meteor/meteor';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import Medias from '/imports/api/media';
import LoadingBar from '../../generic/LoadingBar';
import {
  Box,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Typography,
} from '@mui/material';
import { MediaWithHelpers } from '/imports/api/media/media';

import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';
import Face6TwoToneIcon from '@mui/icons-material/Face6TwoTone';
import FaceRetouchingOffTwoToneIcon from '@mui/icons-material/FaceRetouchingOffTwoTone';

interface MediaItemProps {
  media: MediaWithHelpers;
}

const GetFacesIcon = (numFaces: number): ReactNode => {
  if (numFaces === 0) return <FaceRetouchingOffTwoToneIcon color="warning" />;
  else if (numFaces === 1) return <Face6TwoToneIcon color="success" />;
  else return <PeopleAltTwoToneIcon color="warning" />;
};

const MediaItem = ({ media }: MediaItemProps) => {
  return (
    <ImageListItem>
      <img src={media.getUrl(200, 200)} />
      <ImageListItemBar
        title="Ditzy"
        actionIcon={<IconButton>{GetFacesIcon(media.faces.length)}</IconButton>}
      />
    </ImageListItem>
  );
};

const MediaList = () => {
  const isLoading = useSubscribe('media.all');
  const medias: MediaWithHelpers[] = useFind(() => Medias.find());

  if (isLoading()) return <LoadingBar />;

  return (
    <>
      <Box mb={2}>
        <Typography variant="body1">
          Total: <strong>{medias.length}</strong>
        </Typography>
      </Box>
      <ImageList cols={5}>
        {medias.map((media) => (
          <MediaItem key={media._id} media={media} />
        ))}
      </ImageList>
    </>
  );
};

export default MediaList;
