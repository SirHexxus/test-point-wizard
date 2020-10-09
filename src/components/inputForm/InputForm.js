import React, { useState } from 'react';
import {
	Form,
	Input,
	InputNumber,
	Button,
	Select,
	Switch,
	Tooltip,
} from 'antd';
import Output from '../output/Output';

//	Layout Constants
const layout = {
	labelCol: {
		span: 8,
	},
	wrapperCol: {
		span: 16,
	},
};
const tailLayout = {
	wrapperCol: {
		offset: 10,
		span: 16,
	},
};

//	Array of device classes, to make filling in the Selector below simpler
const deviceClasses = ['III-L', 'IIII', 'III', 'II', 'I'];
const calUnits = [
	{ value: 'lb', name: 'Pounds' },
	{ value: 'kg', name: 'Kilograms' },
	{ name: 'Grams', value: 'g' },
	{ name: 'Other', value: null },
];

//	Component
const InputForm = () => {
	const [output, setOutput] = useState({});
	const [input, setInput] = useState({
		capacity: 0,
		spanPoints: 1,
		increment: null,
		sectionTest: false,
	});
	const [form] = Form.useForm();

	const onFinish = (values) => {
		setOutput(values);
		/* console.log(
			JSON.stringify(
				generateTestPoints(
					values.gradSize,
					values.buildIncrement,
					values.spanPoints,
					values.cornerTest,
					values.sectionTest,
					values.deviceClass,
					values.capacity
				),
				null,
				2
			)
		); 	//	DEBUGGING*/
		console.info('Success:', values); //	Successful Output
	};

	const onFinishFailed = (errorInfo) => {
		console.info('Failed:', errorInfo); //	Unsuccessful Output
		setOutput({});
	};

	const onReset = () => {
		form.resetFields();
		setOutput({});
		setInput({
			capacity: 0,
			spanPoints: 1,
			increment: 1,
			sectionTest: false,
		});
	};

	return (
		<>
			<Form
				{...layout}
				form={form}
				name="basic"
				initialValues={{
					cornerTest: false,
					sectionTest: false,
				}}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				// size="small"
			>
				<Tooltip title="The Increment that the Scale device reads by. Usually ends in a 1, 2, or 5.">
					<Form.Item
						label="Graduation Size"
						name="gradSize"
						rules={[
							{
								required: true,
								message: 'Please input the Graduation Size!',
							},
						]}
					>
						<Input />
					</Form.Item>
				</Tooltip>

				<Tooltip title="The maximum amount of weight that the weighing element (AKA Indicator) will display.">
					<Form.Item
						label="Capacity"
						name="capacity"
						rules={[
							{
								required: true,
								message: "Please input the Scale's Capacity!",
							},
						]}
					>
						<Input
							default={input.capacity}
							onChange={(val) =>
								setInput({
									...input,
									capacity: val,
									increment: Math.floor(
										val / input.spanPoints
									),
								})
							}
						/>
					</Form.Item>
				</Tooltip>

				<Tooltip title="The units of measure with which the device is to be calibrated.">
					<Form.Item
						label="Units"
						name="units"
						rules={[
							{
								required: true,
								message:
									'Please select the units for calibration!',
							},
						]}
					>
						{/* <Input /> */}
						<Select placeholder="Select an option" allowClear>
							{calUnits.map((unit) => (
								<Select.Option
									key={unit.name}
									value={unit.value}
								>
									{unit.name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Tooltip>

				<Tooltip title="The Accuracy Class of the weighing device, as determined by the Manufacturer, and NIST. This app assumes that all tolerances generated must match NIST requirements.">
					<Form.Item
						label="Device Class"
						name="deviceClass"
						rules={[
							{
								required: true,
								message:
									'Please select the class of this device!',
							},
						]}
					>
						{/* <Input /> */}
						<Select placeholder="Select an option" allowClear>
							{deviceClasses.map((entry) => (
								<Select.Option key={entry} value={entry}>
									{entry}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Tooltip>

				<Tooltip title="The number of test points to be tested during the Build Test.">
					<Form.Item
						label="How Many Span Points?"
						name="spanPoints"
						rules={[
							{
								required: true,
								message: 'Please input a build Increment!',
							},
						]}
					>
						<InputNumber
							min={1}
							max={10}
							defaultValue={input.spanPoints}
							onChange={(val) =>
								setInput({
									...input,
									spanPoints: val,
									increment: Math.floor(input.capacity / val),
								})
							}
						>
							{/* {input.spanPoints} */}
						</InputNumber>
					</Form.Item>
				</Tooltip>

				<Tooltip title="The amount of increase between each point of the Build Test.">
					<Form.Item
						label="Build Point Increments"
						name="buildIncrement"
						rules={[
							{
								required: true,
								message: 'Please input a build Increment!',
							},
						]}
					>
						<Input
							defaultValue={input.increment}
							onChange={(val) =>
								setInput({ ...input, increment: val })
							}
						/>
					</Form.Item>
				</Tooltip>

				<Tooltip title="The Shift or Corner Test is used for smaller/ non-vehicle scales to make sure that all areas of the weighing platform are within tolerance to the Standard and to each other. Testpoints are automatically calculated as 1/4 of the maximum capacity.">
					<Form.Item
						label="Will a Corner or Shift Test be performed?"
						name="cornerTest"
					>
						<Switch checkedChildren="Yes" unCheckedChildren="No" />
					</Form.Item>
				</Tooltip>

				<Form.Item
					label="Will a Section Test be performed?"
					name="sectionTest"
				>
					<Tooltip title="The Section Test is used on vehicle scales to make certain that all sections are within tolerance to the Standard as well as each other.">
						<Switch
							checkedChildren="Yes"
							unCheckedChildren="No"
							checked={input.sectionTest}
							onChange={(checked) =>
								setInput({ ...input, sectionTest: checked })
							}
						/>
					</Tooltip>
					{input.sectionTest && (
						<>
							<Tooltip title="A section is defined as the place where a vehicle scale's load cells or weighing levers meet the deck of the scale. Most vehicle scales have between 2 and 5 sections.">
								<Form.Item
									label="How Many Sections?"
									name="sections"
								>
									<InputNumber
										min={1}
										max={25}
										defaultValue={1}
									/>
								</Form.Item>
							</Tooltip>

							<Tooltip title="The weight being used to test the sections of the vehicle scale.">
								<Form.Item
									label="Section Test Span Point"
									name="sectionSpan"
								>
									<Input />
								</Form.Item>
							</Tooltip>
						</>
					)}
				</Form.Item>

				<Form.Item {...tailLayout}>
					<Tooltip title='Submit Form to Generate Test Points'>
					<Button type="primary" htmlType="submit">
						Submit
					</Button>
					</Tooltip>
					<Tooltip title='Reset Form to start over'>
					<Button htmlType="button" onClick={onReset}>
						Reset
					</Button>
					</Tooltip>
				</Form.Item>
			</Form>
			<Output output={output} />
		</>
	);
};

export default InputForm;
