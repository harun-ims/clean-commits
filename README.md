# Guide to Developing a Block in the Form Builder

This guide explains how to create a new block under the `form-elements` folder in the Form Builder. Follow these steps to structure your code and understand the role of each file.

---

## Steps to Create a New Block

### 1. Create a New Folder

- Under the `form-elements` directory, create a new folder with the name of your block.

Example:

```bash
form-elements/
├── text-input/
├── long-text/
├── header/
└── [block-name]/
```

### 2. Add Necessary Files

Inside your block folder, add the following files:

- `attributes.tsx`
- `designer.tsx`
- `properties.tsx`
- `response.tsx`
- `index.tsx`

---

## File Descriptions and Purposes

### `attributes.tsx`

This file defines the default attributes of the block and includes a validation schema.

#### Responsibilities:

- **Default Attributes**: Initial values for the block, such as labels, placeholders, etc.
- **Validation Schema**: Rules for ensuring data integrity using libraries like `yup`.

---

### `designer.tsx`

This component is used in design mode to display how the block looks. The component is **non-interactive** in this mode.

#### Responsibilities:

- Renders the block in a disabled state for preview.
- Provides a visual representation of the block’s layout in the form builder.

---

### `properties.tsx`

This component manages all the editable properties of the block.

#### Responsibilities:

- Provides a form to update attributes such as labels and placeholders.
- Saves modifications via a callback function (`onAttributeSave`).

---

### `response.tsx`

This component is used in preview mode, allowing user interaction with the block.

#### Responsibilities:

- Renders the block for actual use.
- Handles user input and responses.

---

### `index.tsx`

The main entry point for the block, defining its structure and behavior.

#### Responsibilities:

- Exports the block’s configuration and components:
  - **`type`**: Unique identifier for the block.
  - **`designerButton`**: Sidebar button to drag and add the block.
  - **`DesignerComponent`**: Specifies the component for design mode.
  - **`ResponseComponent`**: Specifies the component for preview mode.
  - **`PropertiesComponent`**: Specifies the component for editing properties.
  - **`construct`**: Function to initialize the block when added to the form.

---

## Export the Block from Root `index.tsx`

- Once the block is implemented, export it from the `index.tsx` file in the root of the `form-elements` folder.

Example:

```tsx
import { TextInput } from "./text-input";
import { LongText } from "./long-text";
import { [BlockName] } from "./[block-name]";
import { FormElementTypes } from "./types";

export const FormElements: FormElementTypes = {
  TextInput,
  LongText,
  [BlockName],
};
```

## Block Lifecycle Overview

### General Features

Each block supports the following actions:

1. **Delete**: Removes the block from the form.
2. **Clone**: Creates a duplicate of the block.
3. **Settings**: Opens a sidebar drawer for modifying block attributes.

### Rendering Modes

- **Design Mode (`designer.tsx`)**: Provides a static preview of the block.
- **Properties Mode (`properties.tsx`)**: Enables customization of attributes.
- **Preview Mode (`response.tsx`)**: Interactive version for end-users.

---

## Example: Creating a Text Input Block

Below is a complete implementation of a `TextInput` block.

### File: `attributes.tsx`

```tsx
import * as yup from "yup";

export type Attributes = {
  label: string;
  placeholder: string;
  subLabel: string;
  required: boolean;
};

export const attributes: Attributes = {
  label: "[Field Label]",
  placeholder: "[Placeholder]",
  subLabel: "[Helper text about this field]",
  required: true,
};

export const validationSchema = yup.object().shape({
  label: yup.string().required().label("Label"),
  placeholder: yup.string().required().label("Placeholder"),
  subLabel: yup.string().required().label("Sub Label"),
  required: yup.boolean().label("Required"),
});
```

---

### File: `designer.tsx`

```tsx
import { FormGroup, Input, Label, FormText } from "@ims-systems-00/ims-ui-kit";
import { FormElementInstance } from "../types";
import { Attributes } from "./attributes";

export type DesignerProps = {
  formElement: FormElementInstance;
};

export function Designer({ formElement }: DesignerProps) {
  const element = formElement as FormElementInstance & {
    attributes: Attributes;
  };
  const attributes = element.attributes;

  return (
    <FormGroup>
      <h5>Text Input</h5>
      <p className="pb-4">Use this element for capturing short answers.</p>
      <Label>
        {attributes.label}{" "}
        {attributes.required && <span className="text-danger">*</span>}
      </Label>
      <Input type="text" disabled placeholder={attributes.placeholder} />
      <FormText>{attributes.subLabel}</FormText>
    </FormGroup>
  );
}
```

---

### File: `properties.tsx`

```tsx
import { Button } from "@ims-systems-00/ims-ui-kit";
import { FormElementInstance, OnAttributeSaveFunction } from "../types";
import { Attributes, validationSchema } from "./attributes";
import {
  FormikForm,
  SubmitButton,
  TextFieldWithDataValidation,
} from "../../formik";

export type DesignerProps = {
  formElement: FormElementInstance;
  onAttributeSave?: OnAttributeSaveFunction;
};

type ThisElementInstance = FormElementInstance & {
  attributes: Attributes;
};

export function Properties({ formElement, onAttributeSave }: DesignerProps) {
  const element = formElement as ThisElementInstance;
  const attributes = element.attributes;

  return (
    <FormikForm
      initialValues={attributes}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) => {
        if (typeof onAttributeSave === "function") {
          onAttributeSave(formElement.id, values);
        }
      }}
    >
      <TextFieldWithDataValidation
        name="label"
        label="Question/Label"
        type="text"
        hintText="This text will be displayed at the top of the input field"
      />

      <TextFieldWithDataValidation
        name="placeholder"
        label="Hint/Placeholder"
        type="text"
        hintText="This text will be displayed as a hint in the input field"
      />

      <TextFieldWithDataValidation
        name="subLabel"
        label="Helper Text/Sub-Label"
        type="text"
        hintText="This text will be displayed at the bottom of the input field"
      />

      <SubmitButton>
        <Button color="primary" block>
          Save
        </Button>
      </SubmitButton>
    </FormikForm>
  );
}
```

---

### File: `response.tsx`

```tsx
import { FormGroup, Input, Label } from "@ims-systems-00/ims-ui-kit";
import { FormElementInstance, OnResponseFunction } from "../types";
import { Attributes } from "./attributes";

export type DesignerProps = {
  formElement: FormElementInstance;
  onResponse?: OnResponseFunction;
};

type Custom = FormElementInstance & {
  attributes: Attributes;
};

export function Response({ formElement, onResponse }: DesignerProps) {
  const element = formElement as Custom;
  const attributes = element.attributes;

  return (
    <FormGroup>
      <Label>
        {attributes.label} {attributes.required && "*"}
      </Label>
      <Input
        type="text"
        placeholder={attributes.placeholder}
        onChange={(e) => {
          if (typeof onResponse === "function")
            onResponse(formElement.id, e.currentTarget.value);
        }}
      />
      <Label>
        <small>{attributes.subLabel}</small>
      </Label>
    </FormGroup>
  );
}
```

---

### File: `index.tsx`

```tsx
import { LuTextCursorInput } from "react-icons/lu";
import { FormElement, ElementType } from "../types";
import { attributes } from "./attributes";
import { Designer } from "./designer";
import { Response } from "./response";
import { Properties } from "./properties";

const type: ElementType = "TextInput";

export const TextInput: FormElement = {
  type,
  designerButton: {
    icon: ({ size }) => <LuTextCursorInput size={size} />,
    text: "Text Input",
  },
  construct: (id) => ({ id, type, attributes }),
  DesignerComponent: Designer,
  ResponseComponent: Response,
  PropertiesComponent: Properties,
  validate: () => true,
};
```

---

This guide provides a complete example of implementing a block in the form builder. By following the steps and structure outlined, you can create robust and reusable form components.
