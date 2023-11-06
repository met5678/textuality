import React, { ReactNode } from 'react';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import Medias from '/imports/api/media';
import LoadingBar from '../../generic/LoadingBar';
import {
  Box,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Link,
  Typography,
} from '@mui/material';
import { MediaWithHelpers } from '/imports/api/media/media';

import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';
import Face6TwoToneIcon from '@mui/icons-material/Face6TwoTone';
import FaceRetouchingOffTwoToneIcon from '@mui/icons-material/FaceRetouchingOffTwoTone';
import Players from '/imports/api/players';
import convertToIdDict from '/imports/utils/convert-to-id-dict';
import { PlayerBasic } from '/imports/schemas/player';
import { Link as WouterLink } from 'wouter';

interface MediaItemProps {
  media: MediaWithHelpers;
  player: PlayerBasic;
}

const GetFacesIcon = (numFaces: number): ReactNode => {
  if (numFaces === 0) return <FaceRetouchingOffTwoToneIcon color="warning" />;
  else if (numFaces === 1) return <Face6TwoToneIcon color="success" />;
  else return <PeopleAltTwoToneIcon color="warning" />;
};

const MediaItem = ({ media, player }: MediaItemProps) => {
  return (
    <ImageListItem>
      <img src={media.getUrl(200, 200)} />
      <ImageListItemBar
        title={
          <Link component={WouterLink} to={`/players/${player._id}`}>
            {player.alias}
          </Link>
        }
        subtitle={media.purpose}
        actionIcon={<IconButton>{GetFacesIcon(media.faces.length)}</IconButton>}
      />
    </ImageListItem>
  );
};

const MediaList = () => {
  const loadingHandles = [
    useSubscribe('media.all'),
    useSubscribe('players.basic'),
  ];
  const medias = useFind(() => Medias.find(), []);
  const players = useFind(() => Players.find({}, { fields: { alias: 1 } }), []);

  const playersDict = convertToIdDict(players);
  console.log({ players, playersDict });

  if (loadingHandles.some((loadingHandle) => loadingHandle()))
    return <LoadingBar />;

  return (
    <>
      <Box mb={2}>
        <Typography variant="body1">
          Total: <strong>{medias.length}</strong>
        </Typography>
      </Box>
      <ImageList cols={5}>
        {medias.map((media) => (
          <MediaItem
            key={media._id}
            media={media}
            player={playersDict[media.player]}
          />
        ))}
      </ImageList>
    </>
  );
};

export default MediaList;
