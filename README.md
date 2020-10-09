# Test Point Wizard
For creating test points for scale calibration, based on NIST Handbook 44, Table 6.

## Contents
> - [How To Use](#how-to-use)
> - [Definitions](#definitions)
> - [The Code](#the-code)
> - [More Information](#more-information)


## How To Use
1. Go [here](https://master.d1x92d5azic2h1.amplifyapp.com/) to see the app in action.
2. Fill in All Required Fields, as indicated by the device.
3. Click Submit
    - If you make any errors, you can click Reset to completely reset the form.
4. See your Testpoints generated below the form, along with some identifying information about your device.
    - If you would like to see more information, use the Browser Console (Right click > Inspect > select Console) to see more information.

[ [top](#test-point-wizard) ]
***

## Definitions
> ### Graduation Size
> The Increment that the Scale device reads by. Usually ends in a 1, 2, or 5.

> ### Capacity
> The maximum amount of weight that the weighing element (AKA Indicator) will display.

> ### Units
> Units of measure with which the device is to be calibrated.

> ### Device Class
> The Accuracy Class of the weighing device, as determined by the Manufacturer, and [NIST](https://www.nist.gov/). This app assumes that all tolerances generated must match NIST requirements.

> ### Span Points
> The number of test points to be tested during the Build Test.

> ### Build Increment
> The amount of increase between each point of the Build Test.

> ### Corner/Shift Test
> NIST HB-44 requires that Legal-For-Trade Devices be tested to be certain that all areas of the weighing platform are within tolerance both to the Standard and to each other. The Shift or Corner Test is used for smaller/ non-vehicle scales. Corner Test testpoints are automatically calculated as 1/4 of the maximum capacity of the device.

> ### Section Test
> Used on vehicle scales to make certain that all sections are within tolerance to the Standard as well as each other.
> > ### Number of Sections
> > A section is defined as the place where a vehicle scale's load cells or weighing levers meet the deck of the scale. Most vehicle scales have between 2 and 5 sections.
> > ### Section Test Span Point
> > The weight being used to test the sections of the vehicle scale.

[ [top](#test-point-wizard) ]
***

## The Code
Most of the code in this app is fairly standard React code, but there are a few specific choices that are worth noting:
- Styling was done with the [Ant Design](https://ant.design/) Component Library.
    - This was done primarily due to speed, ease, and familiarity.
- The majority of the functional parts of this app can be found in the file `/src/components/output/OutputService.js`
    - If you would like to get a better idea of how and why the app funtions as it does, check the comments there.
- This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


[ [top](#test-point-wizard) ]
***

## More Information
My name is James Stacy from JMS Web Designs, and I am a Full Stack Web Developer with a background in Weighing				and Measurement and a life-long dedication to solving problems.

I am currently a Freelance Web Developer, specializing in assisting the Weighing & Measurement Industry push for more modern technologies, while being understanding of the rich history and deep traditions that come with being a Scaleman. 

I would be thrilled to answer whatever questions you have about this app, or talk about working on other applications you might have in mind, or just chat about Web Technologies or the Scale Industry. So feel free to reach out any time.

I can be reached at the following:
- Email: [JamesMichaelStacy@gmail.com](mailto:jamesmichaelstacy@gmail.com)
- Facebook Page: [JMS Web Designs](https://www.facebook.com/jmswebdesigns/)
- Facebook Messenger: [JMS Web Designs](https://m.me/jmswebdesigns)
- LinkedIn: [James Stacy](https://www.linkedin.com/in/james-m-stacy)
- Twitter: [James Stacy](https://twitter.com/JamesSt77096668)

[ [top](#test-point-wizard) ]
***
