function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React, { forwardRef, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Platform, requireNativeComponent, TextInput, TouchableWithoutFeedback } from 'react-native';
import TextInputState from 'react-native/Libraries/Components/TextInput/TextInputState';
import setAndForwardRef from './setAndForwardRef';
import TextAncestor from 'react-native/Libraries/Text/TextAncestor';
const LINKING_ERROR = `The package 'react-native-paste-image-input' doesn't seem to be linked. Make sure: \n\n` + Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';
const RCTPasteInput = requireNativeComponent('PasteInput');
if (!RCTPasteInput) {
  // eslint-disable-next-line no-new
  new Proxy({}, {
    get() {
      throw new Error(LINKING_ERROR);
    }
  });
}
const PasteInput = (props, ref) => {
  let selection = useMemo(() => !props.selection ? undefined : {
    start: props.selection.start,
    end: props.selection.end ?? props.selection.start
  }, [props.selection]);
  const inputRef = useRef(null);
  const [mostRecentEventCount, setMostRecentEventCount] = useState(0);
  const [lastNativeText, setLastNativeText] = useState('');
  const [lastNativeSelectionState, setLastNativeSelection] = useState({
    selection,
    mostRecentEventCount
  });
  const text = typeof props.value === 'string' ? props.value : typeof props.defaultValue === 'string' ? props.defaultValue : '';
  const viewCommands = require('react-native/Libraries/Components/TextInput/RCTMultilineTextInputNativeComponent').Commands;
  const lastNativeSelection = lastNativeSelectionState.selection;
  const lastNativeSelectionEventCount = lastNativeSelectionState.mostRecentEventCount;
  if (lastNativeSelectionEventCount < mostRecentEventCount) {
    selection = undefined;
  }

  // This is necessary in case native updates the text and JS decides
  // that the update should be ignored and we should stick with the value
  // that we have in JS.
  useLayoutEffect(() => {
    const nativeUpdate = {};
    if (lastNativeText !== props.value && typeof props.value === 'string') {
      nativeUpdate.text = props.value;
      setLastNativeText(props.value);
    }
    if (selection && lastNativeSelection && (lastNativeSelection.start !== selection.start || lastNativeSelection.end !== selection.end)) {
      nativeUpdate.selection = selection;
      setLastNativeSelection({
        selection,
        mostRecentEventCount
      });
    }
    if (Object.keys(nativeUpdate).length === 0) {
      return;
    }
    if (inputRef.current != null) {
      var _selection, _selection2;
      viewCommands.setTextAndSelection(inputRef.current, mostRecentEventCount, text, ((_selection = selection) === null || _selection === void 0 ? void 0 : _selection.start) ?? -1, ((_selection2 = selection) === null || _selection2 === void 0 ? void 0 : _selection2.end) ?? -1);
    }
  }, [mostRecentEventCount, inputRef, props.value, props.defaultValue, lastNativeText, selection, lastNativeSelection, text, viewCommands]);
  useLayoutEffect(() => {
    const inputRefValue = inputRef.current;
    if (inputRefValue != null) {
      TextInputState.registerInput(inputRefValue);
    }
    return () => {
      if (inputRefValue != null) {
        TextInputState.unregisterInput(inputRefValue);
      }
    };
  }, []);
  useLayoutEffect(() => {
    // const inputRefValue = inputRef.current;
    // When unmounting we need to blur the input
    return () => {
      // inputRefValue?.blur();
    };
  }, []);
  useLayoutEffect(() => {
    setLastNativeText(props.value || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function clear() {
    if (inputRef.current != null) {
      viewCommands.setTextAndSelection(inputRef.current, mostRecentEventCount, '', 0, 0);
    }
  }

  // TODO: Fix this returning true on null === null, when no input is focused
  function isFocused() {
    return TextInputState.currentlyFocusedInput() === inputRef.current;
  }
  function getNativeRef() {
    return inputRef.current;
  }
  const _setNativeRef = setAndForwardRef({
    getForwardedRef: () => ref,
    setLocalRef: localRef => {
      inputRef.current = localRef;

      /*
         Hi reader from the future. I'm sorry for this.
          This is a hack. Ideally we would forwardRef to the underlying
         host component. However, since TextInput has it's own methods that can be
         called as well, if we used the standard forwardRef then these
         methods wouldn't be accessible and thus be a breaking change.
          We have a couple of options of how to handle this:
         - Return a new ref with everything we methods from both. This is problematic
           because we need React to also know it is a host component which requires
           internals of the class implementation of the ref.
         - Break the API and have some other way to call one set of the methods or
           the other. This is our long term approach as we want to eventually
           get the methods on host components off the ref. So instead of calling
           ref.measure() you might call ReactNative.measure(ref). This would hopefully
           let the ref for TextInput then have the methods like `.clear`. Or we do it
           the other way and make it TextInput.clear(textInputRef) which would be fine
           too. Either way though is a breaking change that is longer term.
         - Mutate this ref. :( Gross, but accomplishes what we need in the meantime
           before we can get to the long term breaking change.
         */
      if (localRef) {
        localRef.clear = clear;
        localRef.isFocused = isFocused;
        localRef.getNativeRef = getNativeRef;
      }
    }
  });
  const _onBlur = event => {
    TextInputState.blurInput(inputRef.current);
    if (props.onBlur) {
      props.onBlur(event);
    }
  };
  const _onChange = event => {
    const value = event.nativeEvent.text;
    props.onChange && props.onChange(event);
    props.onChangeText && props.onChangeText(value);
    if (inputRef.current == null) {
      // calling `props.onChange` or `props.onChangeText`
      // may clean up the input itself. Exits here.
      return;
    }
    setLastNativeText(value);
    // This must happen last, after we call setLastNativeText.
    // Different ordering can cause bugs when editing AndroidTextInputs
    // with multiple Fragments.
    // We must update this so that controlled input updates work.
    setMostRecentEventCount(event.nativeEvent.eventCount);
  };
  const _onFocus = event => {
    TextInputState.focusInput(inputRef.current);
    if (props.onFocus) {
      props.onFocus(event);
    }
  };
  const _onPaste = event => {
    if (props.onPaste) {
      const {
        data,
        error
      } = event.nativeEvent;
      props.onPaste(error === null || error === void 0 ? void 0 : error.message, data);
    }
  };
  const _onScroll = event => {
    props.onScroll && props.onScroll(event);
  };
  const _onSelectionChange = event => {
    props.onSelectionChange && props.onSelectionChange(event);
    if (inputRef.current == null) {
      // calling `props.onSelectionChange`
      // may clean up the input itself. Exits here.
      return;
    }
    setLastNativeSelection({
      selection: event.nativeEvent.selection,
      mostRecentEventCount
    });
  };

  // currently not support paste image on Android
  if (Platform.OS === 'android') {
    return /*#__PURE__*/React.createElement(TextInput, _extends({}, props, {
      ref: ref
    }));
  }
  return /*#__PURE__*/React.createElement(TextAncestor.Provider, {
    value: true
  }, /*#__PURE__*/React.createElement(TouchableWithoutFeedback, {
    onLayout: props.onLayout,
    onPressIn: props.onPressIn,
    onPressOut: props.onPressOut,
    accessible: props.accessible,
    accessibilityLabel: props.accessibilityLabel,
    accessibilityRole: props.accessibilityRole,
    accessibilityState: props.accessibilityState,
    testID: props.testID
  }, /*#__PURE__*/React.createElement(RCTPasteInput, _extends({}, props, {
    autoCapitalize: props.autoCapitalize || 'sentences',
    dataDetectorTypes: props.dataDetectorTypes,
    disableFullscreenUI: props.disableFullscreenUI,
    mostRecentEventCount: mostRecentEventCount,
    onBlur: _onBlur,
    onChange: _onChange,
    onContentSizeChange: props.onContentSizeChange,
    onFocus: _onFocus,
    onPaste: _onPaste,
    onScroll: _onScroll,
    onSelectionChange: _onSelectionChange,
    selection: selection,
    style: [props.style],
    textBreakStrategy: props.textBreakStrategy
    // @ts-ignore
    ,
    ref: _setNativeRef
  }))));
};
export default /*#__PURE__*/forwardRef(PasteInput);
//# sourceMappingURL=PasteInput.js.map