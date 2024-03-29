import React, { Fragment, useContext } from 'react';
import { Calendar } from 'react-widgets';
import { Menu, Header } from 'semantic-ui-react';
import { MAIN_COLOR } from '../../../app/constants/common';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';

const ActivityFilters = () => {
  const rootStore = useContext(RootStoreContext);
  const { predicate, setPredicate } = rootStore.activityStore;

  return (
    <Fragment>
      <Menu vertical size={'large'} style={{ width: '100%', marginTop: 30 }}>
        <Header
          icon={'filter'}
          attached
          color={MAIN_COLOR}
          content={'Filters'}
        />
        <Menu.Item
          active={predicate.size === 0}
          onClick={() => setPredicate('all', 'true')}
          color={'blue'}
          name={'all'}
          content={'All activities'}
        />
        <Menu.Item
          active={predicate.has('isGoing')}
          onClick={() => setPredicate('isGoing', 'true')}
          color={'blue'}
          name={'username'}
          content={"I'm going"}
        />
        <Menu.Item
          active={predicate.has('isHost')}
          onClick={() => setPredicate('isHost', 'true')}
          color={'blue'}
          name={'host'}
          content={"I'm hosting"}
        />
      </Menu>
      <Header
        icon={'calendar'}
        attached
        color={MAIN_COLOR}
        content={'Select Date'}
      />
      <Calendar
        onChange={(date?: Date) => setPredicate('startDate', date!)}
        value={predicate.get('startDate') as Date || new Date()}
      />
    </Fragment>
  );
};

export default observer(ActivityFilters);
