
# Form Builder Block Development Guide

## Steps to Develop a New Block

1. **Create a New Folder**
   - Navigate to the `form-elements` folder.
   - Create a new folder named after the block you are developing, e.g., `[block-name]`.

2. **Add the Necessary Files**
   Inside the new folder, add the following files:
   - `attributes.tsx`
   - `designer.tsx`
   - `properties.tsx`
   - `response.tsx`
   - `index.tsx`

### File Descriptions and Their Purpose

#### `attributes.tsx`
This file defines the default attributes of the block and includes its validation schema.

- **Purpose**:
  - Default attributes provide initial values for the block.
  - The validation schema ensures the attributes adhere to defined rules.

#### `designer.tsx`
This file is used in design mode. Initially, it will be disabled and only displays the visual appearance of the element.

- **Purpose**:
  - Show how the element looks without enabling interactivity.

#### `properties.tsx`
This file contains all the modifiable properties of the block.

- **Purpose**:
  - Allows users to edit the properties of the block in the sidebar drawer.

#### `response.tsx`
This file renders the interactive version of the block for use in preview mode.

- **Purpose**:
  - Provides functionality that users can interact with during form completion.

#### `index.tsx`
This file serves as the main entry point for the block.

- **Purpose**:
  - Defines the block type.
  - Registers components for:
    - Sidebar icon (`designerButton`).
    - Design mode rendering (`DesignerComponent`).
    - Interactive mode rendering (`ResponseComponent`).
    - Property management (`PropertiesComponent`).
  - Contains the `construct` function to initialize the block when dragged into the form builder.

## Features
Each form element includes:
- **Delete Icon**: Removes the block.
- **Clone Icon**: Duplicates the block.
- **Settings Icon**: Opens a sidebar drawer for attribute modification.

---

## Example: Text Input Component

Here’s an example of how a `Text Input` component is implemented.

### File Contents

#### `attributes.tsx`

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
  placeholder: "[Place holder]",
  subLabel: "[Helper text about this field]",
  required: true,
};

export const validationSchema = yup.object().shape({
  label: yup.string().required().label("Label"),
  placeholder: yup.string().required().label("Placeholder"),
  defaultValue: yup.string().label("Default Value"),
  subLabel: yup.string().required().label("Sub Label"),
  required: yup.boolean().label("Required"),
});
```

#### `designer.tsx`

```tsx
import { FormGroup, Input, Label, FormText } from "@ims-systems-00/ims-ui-kit";
import { FormElementInstance } from "../types";
import { Attributes } from "./attributes";

export type DesignerProps = {
  formElement: FormElementInstance;
};

type Custom = FormElementInstance & {
  attributes: Attributes;
};
export function Designer({ formElement }: DesignerProps) {
  const element = formElement as Custom;
  const attributes = element.attributes;
  return (
    <FormGroup>
      <h5>Text Input</h5>
      <p className="pb-4">
        Use this element for capturing short answers.
      </p>
      <Label>
        {attributes.label}{" "}
        {attributes.required && <span className="text-danger">*</span>}
      </Label>
      <Input
        type="text"
        disabled
        placeholder={attributes.placeholder}
        defaultValue={attributes.defaultValue}
      />
      <FormText>{attributes.subLabel}</FormText>
    </FormGroup>
  );
}
```

#### `properties.tsx`

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

#### `response.tsx`

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
        defaultValue={attributes.defaultValue}
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

#### `index.tsx`

```tsx
import React from "react";
import { LuTextCursorInput } from "react-icons/lu";
import { FormElement, ElementType } from "../types";
import { attributes } from "./attributes";
import { Designer } from "./designer";
import { Response } from "./response";
import { Properties } from "./properties";

const type: ElementType = "TextInput";

export const TextInput: FormElement = {
  type,
  designerButtton: {
    icon: ({ size }: { size?: number }) => <LuTextCursorInput size={size} />,
    text: "Text input",
  },
  construct: (id: string) => ({
    id,
    type,
    attributes: attributes,
  }),
  DesignerComponent: Designer,
  ResponseComponent: Response,
  PropertiesComponent: Properties,
  validate: () => true,
};
```

---

## Where These Files Are Rendered

- `DesignerComponent`: Used in design mode for previewing the block layout.
- `PropertiesComponent`: Displayed in the sidebar for modifying attributes.
- `ResponseComponent`: Rendered in the form for user interaction.

This structure ensures reusability, modularity, and clean code practices for building and managing form blocks.
