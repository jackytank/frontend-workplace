/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useState } from "react";
import { Embed, models } from "powerbi-client";
import { PowerBIEmbed } from "powerbi-client-react";
import { Button } from "antd";

// Root Component to demonstrate usage of wrapper component
function PowerBiPlayGround() {
  // PowerBI Report object (to be received via callback)
  const [, setReport] = useState<Embed>();

  // API end-point url to get embed config for a sample report
  // const sampleReportUrl =
  //   "https://playgroundbe-bck-1.azurewebsites.net/Reports/SampleReport";
  const sampleReportUrl =
    "https://app.powerbi.com/reportEmbed?reportId=8192d0bf-6982-4785-abba-7d32b9850c8b&autoAuth=true&ctid=18791e17-6159-4f52-a8d4-de814ca8284a";

  // Report config useState hook
  // Values for properties like embedUrl, accessToken and settings will be set on click of buttons below
  const [sampleReportConfig, setReportConfig] = useState({
    type: "report",
    embedUrl: null,
    tokenType: models.TokenType.Embed,
    accessToken: null,
    settings: null
  });

  const eventHandlersMap = new Map([
    ['loaded', function () {
      console.log('Report loaded');
    }],
    ['rendered', function () {
      console.log('Report rendered');
    }],
    ['error', function (event: { detail: any; }) {
      console.log(event.detail);
    }]
  ]);

  const mockSignIn = async () => {
    const reportConfigResponse = await fetch(sampleReportUrl);
    if (!reportConfigResponse.ok) {
      console.error(
        `Failed to fetch config for report. Status: ${reportConfigResponse.status} ${reportConfigResponse.statusText}`
      );
      return;
    }
    const reportConfig = await reportConfigResponse.json();
    setMessage(
      "The access token is successfully set. Loading the Power BI report"
    );
    setReportConfig({
      ...sampleReportConfig,
      embedUrl: reportConfig.EmbedUrl,
      accessToken: reportConfig.EmbedToken.Token
    });
  };

  const changeSettings = () => {
    // Update the state "sampleReportConfig" and re-render DemoApp component
    setReportConfig({
      ...sampleReportConfig,
      settings: {
        panes: {
          filters: {
            expanded: false,
            visible: false
          }
        }
      }
    });
  };

  const [displayMessage, setMessage] = useState(
    `The report is bootstrapped. Click the Embed Report button to set the access token`
  );

  const controlButtons = (
    <div className="controls">
      <Button onClick={mockSignIn}>Embed Report</Button>

      <Button onClick={changeSettings}>Hide filter pane</Button>
    </div>
  );

  const header = (
    <div className="header">
      <div className="title">Power BI React component demo</div>
    </div>
  );

  return (
    <div>
      {header}

      <PowerBIEmbed
        embedConfig={sampleReportConfig}
        eventHandlers={eventHandlersMap}
        cssClassName={"report-style-class"}
        getEmbeddedComponent={(embedObject) => {
          console.log(
            `Embedded object of type "${embedObject.embedtype}" received`
          );
          setReport(embedObject);
        }}
      />

      <div className="hr"></div>

      <div className="displayMessage">{displayMessage}</div>

      {controlButtons}

      <iframe
        title="tri_visual"
        width="1140"
        height="541.25"
        src="https://app.powerbi.com/reportEmbed?reportId=8192d0bf-6982-4785-abba-7d32b9850c8b&autoAuth=true&ctid=18791e17-6159-4f52-a8d4-de814ca8284a"
      />


    </div>
  );
}

export default PowerBiPlayGround;
