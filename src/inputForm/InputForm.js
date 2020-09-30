import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, Select, Spin, Switch } from 'antd';

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

const inRange = (num, a, b) => Math.min(a, b) <= num && num < Math.max(a, b);

const toleranceChart = [
	{
		class: 'III L',
		tolerances: [
			{
				min: 0,
				max: 500,
				gradsAllowed: 1,
			},
			{
				min: 501,
				max: 1000,
				gradsAllowed: 2,
			},
			{
				min: 1001,
				gradsAllowed: (grads) => Math.ceil(grads / 500),
			},
		],
	},
	{
		class: 'IIII',
		tolerances: [
			{
				min: 0,
				max: 50,
				gradsAllowed: 1,
			},
			{
				min: 51,
				max: 200,
				gradsAllowed: 2,
			},
			{
				min: 201,
				max: 400,
				gradsAllowed: 3,
			},
			{
				min: 401,
				max: null,
				gradsAllowed: 5,
			},
		],
	},
	{
		class: 'III',
		tolerances: [
			{
				min: 0,
				max: 500,
				gradsAllowed: 1,
			},
			{
				min: 501,
				max: 2000,
				gradsAllowed: 2,
			},
			{
				min: 2001,
				max: 4000,
				gradsAllowed: 3,
			},
			{
				min: 4001,
				max: null,
				gradsAllowed: 5,
			},
		],
	},
	{
		class: 'II',
		tolerances: [
			{
				min: 0,
				max: 5000,
				gradsAllowed: 1,
			},
			{
				min: 5001,
				max: 20000,
				gradsAllowed: 2,
			},
			{
				min: 20001,
				max: null,
				gradsAllowed: 3,
			},
		],
	},
	{
		class: 'I',
		tolerances: [
			{
				min: 0,
				max: 50000,
				gradsAllowed: 1,
			},
			{
				min: 50001,
				max: 200000,
				gradsAllowed: 2,
			},
			{
				min: 200001,
				max: null,
				gradsAllowed: 3,
			},
		],
	},
];

const Output = props => {
    const { output } = props;
    const { status, gradSize, capacity, units, deviceClass, buildIncrement, spanPoints, cornerTest, sectionTest, tolerances } = output;
    const gradCount = gradSize * capacity;
    const testPoints = (gradSize, buildIncrement, spanPoints, cornerTest, sectionTest, tolerances, capacity) => {
        const testPointArray = [];
        for(let i = 1; i <= spanPoints; i++) {
            const testpoint = buildIncrement * i;
            const testTol =  tolerances.tolerances.find(tol => inRange(testpoint, tol.min, tol.max))
            testPointArray.push({
                order: i,
                testpoint,
                tolerance: (testTol.gradsAllowed) * gradSize
            })
        }
        cornerTest && testPointArray.push({ order: "corner", testpoint: capacity/4, tolerance: (tolerances.tolerances.find(tol => inRange(capacity/4, tol.min, tol.max))).gradsAllowed * gradSize })
        
        sectionTest && testPointArray.push({ order: "section", testpoint: buildIncrement, tolerance: (tolerances.tolerances.find(tol => inRange(buildIncrement, tol.min, tol.max))).gradsAllowed * gradSize })

        return testPointArray;
    }
    return (!status) ? <Spin /> : <>
        <div>Capacity & Grad Size: {`${capacity} ${units} x ${gradSize}`}</div>
        <div>Class {deviceClass}</div>
        <div>Number of Divisions: {gradCount}</div>
        <div>
            Test Points:
            {testPoints(gradSize, buildIncrement, spanPoints, cornerTest, sectionTest, tolerances, capacity).map(point => {
                return(
                    <div>
                    {`${point.order}: ${point.testpoint} +/-${point.tolerance}`}
                    </div>
                )
            })}
        </div>
    </>
}

const InputForm = () => {
    const [output, setOutput] = useState({status: false});
    const [capacity, setCapacity] = useState(0);
    const [spanPoints, setSpanPoints] = useState(1);
    const [increment, setIncrement] = useState(0);
	const [form] = Form.useForm();

	const onFinish = (values) => {
        values.status = true;
		const { deviceClass } = values;
		values.tolerances = toleranceChart.find(
			(classes) => classes.class === deviceClass
        );
        setOutput(values);
		console.log(values.tolerances);
		console.log('Success:', values);
	};

	const onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
        setOutput({status: false});
	};

	const onReset = () => {
        form.resetFields();
		setOutput({status: false});
		setCapacity(0);
		setSpanPoints(1);
		setIncrement(0);
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
                    default={capacity}
                    onChange={
                        val => {
                            setCapacity(val);
                            setIncrement(Math.floor(val/spanPoints));
                        }
                    }
                />
			</Form.Item>

			<Form.Item
				label="Units"
				name="units"
				rules={[
					{
						required: true,
						message: 'Please select the units for calibration!',
					},
				]}
			>
				{/* <Input /> */}
				<Select
                    placeholder="Select an option"
                    allowClear
                >
					<Select.Option value="lb">Pounds</Select.Option>
					<Select.Option value="kg">Kilograms</Select.Option>
					<Select.Option value="g">Grams</Select.Option>
					<Select.Option value="other">Other</Select.Option>
				</Select>
			</Form.Item>

			<Form.Item
				label="Device Class"
				name="deviceClass"
				rules={[
					{
						required: true,
						message: 'Please select the class of this device!',
					},
				]}
			>
				{/* <Input /> */}
				<Select
                    placeholder="Select an option"
                    allowClear
                >
					{toleranceChart.map((entry) => (
						<Select.Option key={entry.class} value={entry.class}>
							{entry.class}
						</Select.Option>
					))}
				</Select>
			</Form.Item>

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
                    defaultValue={spanPoints}
                    onChange={
                        val => {
                            setSpanPoints(val);
                            setIncrement(Math.floor(capacity/val));
                        }
                    }
                />
			</Form.Item>

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
                    defaultValue={increment}
                    onChange={val => setIncrement(val)}
                />
			</Form.Item>

			<Form.Item
                label="Will a Corner or Shift Test be performed?"
				name="cornerTest"
			>
				<Switch checkedChildren="Yes" unCheckedChildren="No" />
			</Form.Item>

			<Form.Item
                label="Will a Section Test be performed?"
				name="sectionTest"
			>
				<Switch checkedChildren="Yes" unCheckedChildren="No" />
			</Form.Item>

			<Form.Item {...tailLayout}>
				<Button type="primary" htmlType="submit">
					Submit
				</Button>
				<Button htmlType="button" onClick={onReset}>
					Reset
				</Button>
			</Form.Item>
		</Form>
        <Output output={output} />
        </>
    );
};

export default InputForm;
