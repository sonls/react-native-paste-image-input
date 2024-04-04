"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _TextInputState = _interopRequireDefault(require("react-native/Libraries/Components/TextInput/TextInputState"));
var _setAndForwardRef = _interopRequireDefault(require("./setAndForwardRef"));
var _TextAncestor = _interopRequireDefault(require("react-native/Libraries/Text/TextAncestor"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const LINKING_ERROR = `The package 'react-native-paste-image-input' doesn't seem to be linked. Make sure: \n\n` + _reactNative.Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';
const RCTPasteInput = (0, _reactNative.requireNativeComponent)('PasteInput');
if (!RCTPasteInput) {
  // eslint-disable-next-line no-new
  new Proxy({}, {
    get() {
      throw new Error(LINKING_ERROR);
    }
  });
}
const PasteInput = (props, ref) => {
  let selection = (0, _react.useMemo)(() => !props.selection ? undefined : {
    start: props.selection.start,
    end: props.selection.end ?? props.selection.start
  }, [props.selection]);
  const inputRef = (0, _react.useRef)(null);
  const [mostRecentEventCount, setMostRecentEventCount] = (0, _react.useState)(0);
  const [lastNativeText, setLastNativeText] = (0, _react.useState)('');
  const [lastNativeSelectionState, setLastNativeSelection] = (0, _react.useState)({
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
  (0, _react.useLayoutEffect)(() => {
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
  (0, _react.useLayoutEffect)(() => {
    const inputRefValue = inputRef.current;
    if (inputRefValue != null) {
      _TextInputState.default.registerInput(inputRefValue);
    }
    return () => {
      if (inputRefValue != null) {
        _TextInputState.default.unregisterInput(inputRefValue);
      }
    };
  }, []);
  (0, _react.useLayoutEffect)(() => {
    // const inputRefValue = inputRef.current;
    // When unmounting we need to blur the input
    return () => {
      // inputRefValue?.blur();
    };
  }, []);
  (0, _react.useLayoutEffect)(() => {
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
    return _TextInputState.default.currentlyFocusedInput() === inputRef.current;
  }
  function getNativeRef() {
    return inputRef.current;
  }
  const _setNativeRef = (0, _setAndForwardRef.default)({
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
    _TextInputState.default.blurInput(inputRef.current);
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
    _TextInputState.default.focusInput(inputRef.current);
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
  if (_reactNative.Platform.OS === 'android') {
    return /*#__PURE__*/_react.default.createElement(_reactNative.TextInput, _extends({}, props, {
      ref: ref
    }));
  }
  return /*#__PURE__*/_react.default.createElement(_TextAncestor.default.Provider, {
    value: true
  }, /*#__PURE__*/_react.default.createElement(_reactNative.TouchableWithoutFeedback, {
    onLayout: props.onLayout,
    onPressIn: props.onPressIn,
    onPressOut: props.onPressOut,
    accessible: props.accessible,
    accessibilityLabel: props.accessibilityLabel,
    accessibilityRole: props.accessibilityRole,
    accessibilityState: props.accessibilityState,
    testID: props.testID
  }, /*#__PURE__*/_react.default.createElement(RCTPasteInput, _extends({}, props, {
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
var _default = /*#__PURE__*/(0, _react.forwardRef)(PasteInput);
exports.default = _default;
//# sourceMappingURL=PasteInput.js.map