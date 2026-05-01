import Input from "../ui/Input";
import Button from "../ui/Button";

interface PlaylistFormProps {
  buttonLabel: string;
  creationError: string;
  inputValue: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder: string;
}

const PlaylistForm = ({
  buttonLabel,
  creationError,
  inputValue,
  onChange,
  onSubmit,
  placeholder,
}: PlaylistFormProps) => {
  return (
    <div className="playlist-browser-form-group">
      <form className="playlist-browser-create" onSubmit={onSubmit}>
        <Input
          value={inputValue}
          onChange={onChange}
          placeholder={placeholder}
        />
        <Button variant="primary" type="submit">
          {buttonLabel}
        </Button>
      </form>

      {creationError ? (
        <div className="playlist-browser-error">{creationError}</div>
      ) : null}
    </div>
  );
};

export default PlaylistForm;
