import React, { useState, useEffect} from "react";
import { Box, Grid, Avatar } from "@mui/material";

import Highlight from "../components/Highlight";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../configs";

export const ProfileComponent = () => {
  const { user, getAccessTokenSilently  } = useAuth0();
  const [userMetadata, setUserMetadata] = useState(null);

  useEffect(() => {
    const getUserMetadata = async () => {
      const domain = getConfig().domain;
  
      try {
        const accessToken = await getAccessTokenSilently({
          audience: `https://${domain}/api/v2/`,
          scope: "read:current_user",
        });
  
        const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;
        
        const metadataResponse = await fetch(userDetailsByIdUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        
        const { user_metadata } = await metadataResponse.json();
  
        setUserMetadata(user_metadata);
      } catch (e) {
        console.log(e.message);
      }
    };
  
    getUserMetadata();
  }, [getAccessTokenSilently, user?.sub]);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item md={2}>
        <Avatar alt={user.name} src={user.picture} 
        sx={{ width: 120, height: 120 }}/>
        </Grid>
        <Grid item>
          <h2>{user.name}</h2>
          <p className="lead text-muted">{user.email}</p>
        </Grid>
      </Grid>
      <Grid>
        <Highlight>{userMetadata ? (
          <pre>{JSON.stringify(userMetadata, null, 2)}</pre>
        ) : (
          "No user metadata defined"
        )}</Highlight>
      </Grid>
    </Box>
  );
};

export default withAuthenticationRequired(ProfileComponent, {
  onRedirecting: () => <Loading />,
});
