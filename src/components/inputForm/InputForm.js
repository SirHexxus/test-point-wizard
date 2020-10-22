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
		values.buildIncrement = values.buildIncrement || input.increment;
		values.gradSize = parseFloat(values.gradSize);
		values.spanPoints = parseInt(values.spanPoints);
		values.capacity = parseInt(values.capacity);
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
			increment: null,
			sectionTest: false,
		});
		console.clear();
	};

	return (
		<>
			<Form
				{...layout}
				form={form}
				name="input"
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
							// {
							// 	type: 'number',
							// 	message: 'Please enter a number.',
							// },
							{
								validator: (_, value) => {
									return 0.000000001 <= value && value <= 100
										? Promise.resolve()
										: Promise.reject(
												'Out of Range (Must be between 0.000000001 and 100)'
										  )},
							}
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
							{
								validator: (_, value) => {
									return 0 < value && value <= 1_000_000
										? Promise.resolve()
										: Promise.reject(
												'Out of Range (Must be between 0 and 1,000,000)'
										  )},
							}
						]}
					>
						<Input
							default={input.capacity}
							onChange={e => {
								setInput({
									...input,
									capacity: parseInt(e.target.value),
									increment: Math.floor(e.target.value / input.spanPoints )
								})
							}}
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
							onChange={(e) =>{
								console.log(e)
								setInput({
									...input,
									spanPoints: e,
									increment: Math.floor(input.capacity / e),
								})
							}}
						>
							{/* {input.spanPoints} */}
						</InputNumber>
					</Form.Item>
				</Tooltip>

				<Tooltip title="The amount of increase between each point of the Build Test. An Increment will be calculated if not entered.">
					<Form.Item
						label="Build Point Increments"
						name="buildIncrement"
						onChange={(e) =>
							setInput({ ...input, increment: parseInt(e.target.value) })
						}
						rules={[
							{
								validator: (_, value) => {
									const cap = input.capacity
									console.log(value)
									return (0 < value && value <= cap) || input.increment
										? Promise.resolve()
										: Promise.reject(
												'Out of Range (Must be more than zero, and less than the capacity)'
										  )},
							}
						]}
					>
						<Input value={input.increment}/>
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
							onChange={(e) =>
								setInput({ ...input, sectionTest: e })
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
					<Tooltip title="Submit Form to Generate Test Points">
						<Button type="primary" htmlType="submit">
							Submit
						</Button>
					</Tooltip>
					<Tooltip title="Reset Form to start over">
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
