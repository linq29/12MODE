import React from 'react';

const MainArea: React.FC = ({ children }) => (
  <section className="center-column">
    <div className="main-area">
      {children}
    </div>
  </section>
);

export default MainArea;
