import React from 'react';
import { mount } from 'enzyme';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Popover from '..';
import mountTest from '../../../tests/shared/mountTest';
import ConfigProvider from '../../config-provider';

describe('Popover', () => {
  mountTest(Popover);

  it('should show overlay when trigger is clicked', () => {
    const ref = React.createRef();

    const popover = mount(
      <Popover ref={ref} content="console.log('hello world')" title="code" trigger="click">
        <span>show me your code</span>
      </Popover>,
    );

    expect(ref.current.getPopupDomNode()).toBe(null);

    popover.find('span').simulate('click');
    expect(popover.find('Trigger PopupInner').props().visible).toBeTruthy();
  });

  it('shows content for render functions', () => {
    const renderTitle = () => 'some-title';
    const renderContent = () => 'some-content';
    const ref = React.createRef();

    const popover = mount(
      <Popover ref={ref} content={renderContent} title={renderTitle} trigger="click">
        <span>show me your code</span>
      </Popover>,
    );

    popover.find('span').simulate('click');

    const popup = ref.current.getPopupDomNode();
    expect(popup).not.toBe(null);
    expect(popup.innerHTML).toContain('some-title');
    expect(popup.innerHTML).toContain('some-content');
    expect(popup.innerHTML).toMatchSnapshot();
  });

  it('handles empty title/content props safely', () => {
    const ref = React.createRef();

    const popover = mount(
      <Popover trigger="click" ref={ref}>
        <span>show me your code</span>
      </Popover>,
    );

    popover.find('span').simulate('click');

    const popup = ref.current.getPopupDomNode();
    expect(popup).toBe(null);
  });

  it('should not render popover when the title & content props is empty', () => {
    const ref = React.createRef();

    const popover = mount(
      <Popover trigger="click" ref={ref} content="">
        <span>show me your code</span>
      </Popover>,
    );

    popover.find('span').simulate('click');
    const popup = ref.current.getPopupDomNode();

    expect(popup).toBe(null);
  });

  it('props#overlay do not warn anymore', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const overlay = jest.fn();
    render(
      <Popover content="console.log('hello world')" title="code" trigger="click">
        <span>show me your code</span>
      </Popover>,
    );

    expect(errorSpy).not.toHaveBeenCalled();
    expect(overlay).not.toHaveBeenCalled();
  });

  it(`should be rendered correctly in RTL direction`, () => {
    const wrapper = mount(
      <ConfigProvider direction="rtl">
        <Popover title="RTL" visible>
          <span>show me your Rtl demo</span>
        </Popover>
      </ConfigProvider>,
    );
    expect(wrapper.render()).toMatchSnapshot();
  });
});
