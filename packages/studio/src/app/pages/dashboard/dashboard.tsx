import React, {useEffect, useContext} from "react";
import { Button, Drawer, DrawerContent, DrawerContentBody, DrawerPanelContent, Level, LevelItem, Title, PageSection, PageSectionVariants } from '@patternfly/react-core';
import '../../app.css';
import { ApiDrawer, ApiEmptyState, ApiToolbar } from '../../components';
import {Link} from 'react-router-dom';
import { Services } from './../../common';
import { StoreContext } from './../../../context/StoreContext';
import {Api} from "@apicurio/models";
import { useStoreContext } from './../../../context/reducers';
import { ApiNotificationDrawer } from './../../components/api/apiNotificationDrawer/apiNotificationDrawer';
import { ApiDesignChange } from "@apicurio/models";

export const Dashboard = () => {

  const apisService = Services.getInstance().apisService;
  const userService = Services.getInstance().currentUserService;
  const { apiData, dashboardView, notificationDrawerExpanded } = useStoreContext();
  const [state, setState] = useContext(StoreContext);
  const activityStart: number = 0;
  const activityEnd: number = 10;

  const fetchDataAction = async () => {
    apisService.getApis()
    .then( apis => {
      const insideApis: Api[] = apis.data;
      return insideApis;
    })
    .then((insideApis) => {
        setState({...state, apiData: insideApis});
    })
    .catch(error => {
      console.error("error getting API" + error);
    });
   }

  const fetchActivityAction = async () => {
    userService.getActivity(activityStart, activityEnd)
    .then( activity => {
        const activityData: ApiDesignChange[] = activity.data;
        return activityData;
    })
    .then(function(activityData) {
        setState({...state, recentActivityData: activityData});
    })
    .catch(error => {
      console.error("error getting API" + error);
    });
   }

  useEffect(() => {
    fetchDataAction();
    fetchActivityAction();
  }, []);

  const panelContent = (
    <ApiNotificationDrawer/>
  );

    const apiCount = apiData.length;

    return (
      <React.Fragment>
        <Drawer isExpanded={notificationDrawerExpanded}>
            <DrawerContent panelContent={panelContent}>
              <DrawerContentBody>
                <PageSection variant={PageSectionVariants.light} className="app-page-section-border-bottom">
                  <Level>
                    <LevelItem>
                      <Title headingLevel="h1" size="3xl">
                        APIs
                      </Title>
                    </LevelItem>
                    <LevelItem className="app-button-group-md">
                      <Link to="/import-api">
                        <Button variant="secondary">
                          Import API
                        </Button>
                      </Link>
                      <Link to="/create-api">
                        <Button variant="primary">
                          Create new API
                        </Button>
                      </Link>
                    </LevelItem>
                  </Level>
                </PageSection>
                <PageSection variant={PageSectionVariants.light} noPadding={true} className="app-page-section-border-bottom">
                  <ApiToolbar/>
                </PageSection>
              <PageSection noPadding={true}>
                {apiCount >= 8 ? (
                  <ApiEmptyState />
                ) : (
                  <ApiDrawer dashboardView={dashboardView}/>
                )}
              </PageSection>
            </DrawerContentBody>
          </DrawerContent>
        </Drawer>
      </React.Fragment>
    );
  };
