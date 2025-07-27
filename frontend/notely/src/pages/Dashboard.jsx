import React from 'react';
// import Sidebar from '../components/Sidebar';
// import RichTextEditor from '../components/RichTextEditor';
import styled from 'styled-components'; // Ensure styled-components is imported
import Dashboard from '../components/Dashboard';  

import NotelyDashboard from '../components/NotelyDashboard';


function View() {
  return (
    <StyledWrapper>
      <div className="viewPage">
          <NotelyDashboard />;
          {/* <Dashboard /> */}
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .viewPage {
    display: flex;
    flex-direction: column;
    height: 100vh; 
  }

 
`;

export default View;
