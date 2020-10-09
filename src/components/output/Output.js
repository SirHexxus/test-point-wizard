import React from 'react';
import { Spin } from 'antd';
import { generateTestPoints } from './OutputService';

const Output = (props) => {
	const { output } = props;
	const { gradSize, capacity, units, deviceClass } = output;
	const gradCount = capacity / gradSize;
	const outputTestpoints = generateTestPoints(
		output.gradSize,
		output.buildIncrement,
		output.spanPoints,
		output.cornerTest,
        output.sectionSpan,
        output.sections,
		output.deviceClass,
		output.capacity
	);
	return JSON.stringify(output) === '{}' ? (
		<Spin />
	) : (
		<>
            {console.info("Success!", output, outputTestpoints)}
			<div>
				Capacity & Grad Size: {`${capacity} ${units} x ${gradSize}`}
			</div>
			<div>Class {deviceClass}</div>
			<div>Number of Divisions: {gradCount}</div>
			<div>
				Test Points:
				{outputTestpoints.map((point) => {
					return (
						<div key={point.order}>
							{`${point.order}: ${point.testpoint} +/-${point.tolerance}`}
						</div>
					);
				})}
			</div>
		</>
	);
};

export default Output;
