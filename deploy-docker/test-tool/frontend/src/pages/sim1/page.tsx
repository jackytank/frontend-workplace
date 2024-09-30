import React from 'react';
import { getSelectedProfile } from '../../utils/helper';

const Sim1Page = () => {

  const profile = getSelectedProfile();

  return (
    <>
      <div>Sim1Page</div>
      <div>{profile?.aws_access_key_id}</div>
      <div>{profile?.aws_secret_access_key}</div>
      <div>{profile?.region}</div>
    </>
  );
};

export default Sim1Page;