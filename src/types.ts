import type { TextInputProps } from 'react-native';

export interface RCTPasteInputProps extends TextInputProps {
  mostRecentEventCount: number;
  onPaste?: (event: PasteEvent) => void;
}

export interface PasteInputProps extends TextInputProps {
  onPaste?: (
    error: string | null | undefined,
    files: Array<PastedFile>
  ) => void;
}

export interface Selection {
  start: number;
  end?: number | undefined;
}

export interface TextInputNativeCommands {
  focus: (viewRef: unknown) => void;
  blur: (viewRef: unknown) => void;
  setTextAndSelection: (
    viewRef: unknown,
    mostRecentEventCount: number,
    value: string | null, // in theory this is nullable
    start: number,
    end: number
  ) => void;
}

export interface PastedFile {
  fileName: string;
  fileSize: number;
  type: string;
  uri: string;
}

export interface PasteEvent {
  nativeEvent: {
    data: Array<PastedFile>;
    error?: {
      message: string;
    };
  };
}
