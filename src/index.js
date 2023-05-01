import * as d3 from 'd3';
import { textwrap } from 'd3-textwrap';

const width = 2000;
const height = 800;
const nodeRadius = 70;
const spaceApart = 130;

const convertListToObject = function(list) {
    return list.reduce((accumulator, current) => {
        accumulator[current.id] = current;
        return accumulator;
    }, {});
}

// create a text wrapping function
const textPadding = 20;
const wrap = textwrap()
    .bounds({height: nodeRadius * 2 - textPadding * 2, width: nodeRadius * 2 - textPadding * 2});

let nodes = [
    {
        id: 'data-storage',
        text: 'Data Storage',
        x: nodeRadius * 2,
        y: height / 2,
        children: [{
            id: 'nasa-earthdata-cloud',
            text: 'The future of NASA Earth Science in the Commercial Cloud: Challenges and Opportunities',
            tags: ['data-storage', 'U.S.']
        }, {
            id: 'pangeo-esgf-cmip6',
            text: 'Pangeo and ESGF Collaboration on Storing CMIP6 in Zarr in the Cloud (Google Cloud)',
            tags: ['data-storage', 'cross-agency-collaboration', 'structured-data']
        }, {
            id: 'cscale-data-storage',
            text: 'C-Scale Data Storage: FedEarthData',
            tags: ['data-storage', 'Europe']
        }]
    },
    {
        id: 'structured-data',
        text: 'Structured Data',
        x: nodeRadius * 3 + 1 * spaceApart,
        y: height / 2,
        children: [{
            id: 'stare',
            text: 'STARE Indexing: Harmonizing Diverse Geo-Spatiotemporal Data for Event Analytics',
            tags: ['structured-data', 'U.S.'],
            children: [{
                id: 'stare-more',
                text: 'STARE indexes data by "location" and "zipcode" using triangles. Sounds and looks similar to how a quadtree key works.'
            }]
        }, {
            id: 'sarxarray',
            text: 'SARXarray: An Xarray extension to process coregistered Single Look Complex (SLC) image stacks acquired by Synthetic Aperture Radar (SAR). https://github.com/MotionbyLearning/sarxarray',
            tags: ['structured-data', 'U.S.']
        }, {
            id: 'gapfilled-s2',
            text: 'Gap-Filled Sentinel-2 using HISTARFM'
        }]
    },
    {
        id: 'data-access',
        text: 'Data Access',
        x: nodeRadius * 4 + 2 * spaceApart,
        y: height / 2,
        children: [{
            id: 'new-copernicus-data-access-service',
            text: 'New Copernicus Data Access Service',
            tags: ['data-access', 'Europe', 'data-formats'],
            children: [{
                id: 'copernicus-technology',
                text: 'They are releasing a STAC catalog for Sentinel Data but still in JPEG2000'
            }]
        }, {
            id: 'cscale-data-access',
            text: 'C-SCALE Data Access: Federate Copernicus resources with EOSC computing and storage providers',
            tags: ['data-access', 'Europe', 'cross-agency-collaboration']

        }]
    },
    {
        id: 'data-discovery',
        text: 'Data Discovery',
        x: nodeRadius * 5 + 3 * spaceApart,
        y: height / 2,
        children: [{
            id: 'cscale-data-discovery',
            text: 'C-SCALE\'s Earth Observation Metadata Query Service',
            tags: ['data-discovery', 'Europe', 'cross-agency-collaboration'],
            children: [{
                id: 'cscale-data-discovery-more',
                text: 'STAC interface to enable queries across the federation, EO-MQS is a query broker and aggregator.'
            }]
        }, {
            id: 'geospatial-discovery-network',
            text: 'Geospatial Discovery Network (IBM, MSFC)',
            tags: ['data-discovery', 'U.S.'],
            children: [{
                id: 'geospatial-discovery-network-more',
                text: 'An architecture for multi-cloud search and discovery to enable federated analytics, solving problems like AI-based flood detection.'
            }]
        }]
    },
    {
        id: 'earth-modeling',
        text: 'Earth Modeling',
        x: nodeRadius * 6 + 4 * spaceApart,
        y: height / 2,
        children: [{
            id: 'foundational-models-for-earth-science',
            text: 'Foundational Models for Earth Science (Rahul, MSFC)',
            link: 'https://docs.google.com/presentation/d/1GxD62IUJwJBf4WBQkoYg8ZqkSAAD_FUY0bfl2IGjJQU/edit#slide=id.g135bd155e81_0_0',
            tags: ['earth-modeling', 'U.S.']
        }, {
            id: 'jedi',
            text: 'Joint Effort on Data assimilation Integration (JEDI)',
            tags: ['earth-modeling', 'U.S.']
        }]
    }, {
        id: 'science-platforms',
        text: '(Open?) Science Platforms',
        x: nodeRadius * 7 + 5 * spaceApart,
        y: height / 2,
        children: [{
            id: 'eosc',
            text: 'European Open Science Cloud',
            tags: ['science-platforms', 'Europe']
        }, {
            id: 'unidata-science-gateway',
            text: 'Unidata Science Gateway',
            tags: ['science-platforms', 'U.S.']
        }, {
            id: 'cscale-platform',
            text: 'C-SCALE? Mentions OpenEO Platform, or is it just a federation of data sources',
            tags: ['science-platforms', 'Europe']
        }]
    }, {
        id: 'science-applications',
        text: 'Science Applications',
        x: nodeRadius * 8 + 6 * spaceApart,
        y: height / 2,
        children: [{
            id: 'buildspace',
            text: 'BUILDSPACE'
        }, {
            id: 'eo-ai4floods',
            text: 'EO AI4Floods'
        }, {
            id: 'european-weather',
            text: 'European Weather Cloud'
        }]
    }
];
let nodesAsDict = convertListToObject(nodes);

let links = [
    {source: 'data-storage', target: 'structured-data'},
    {source: 'structured-data', target: 'data-access'},
    {source: 'data-access', target: 'data-discovery'},
    {source: 'data-discovery', target: 'earth-modeling'},
    {source: 'earth-modeling', target: 'science-platforms'},
    {source: 'science-platforms', target: 'science-applications'}
];

const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

function update() {
    let textElements = [];    
    const link = svg.selectAll(".link")
        .data(links)
        .join("line")
        .attr("class", "link")
        .attr("x1", d => nodesAsDict[d.source].x)
        .attr("y1", d => nodesAsDict[d.source].y)
        .attr("x2", d => nodesAsDict[d.target].x)
        .attr("y2", d => nodesAsDict[d.target].y);
    
    // Create group elements and bind data
    let group = svg.selectAll("g")
        .data(nodes)
        .join("g") 

    const node = group.append("circle")
        .data(nodes)
        .join("circle")
        .attr("class", "node")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", nodeRadius)
        .on("click", (event, d) => {
            if (d.children && !d.expanded) {               
                let newNodes = [];
                d.children.forEach((childNode, i) => {
                    let x = d.x - nodeRadius + i * spaceApart;
                    let y = d.y + nodeRadius * 2 + i * nodeRadius;
                    childNode['x'] = x;
                    childNode['y'] = y;
                    newNodes.push(childNode)
                    nodesAsDict[childNode.id] = childNode;                                     
                });

                const newLinks = newNodes.map(n => ({source: d.id, target: n.id}));
            
                nodes = nodes.concat(newNodes);
                links = links.concat(newLinks);

                d['expanded'] = true;
                update();
            }
            d3.select(this).style("fill", 'grey');     
        });

    group.append('text')
        .data(nodes)
        .attr("x", d => d.x - nodeRadius + textPadding) // Set the x position of the text element
        .attr("y", d => d.y - nodeRadius + textPadding) // Set the y position of the text element
        .classed("text", true) // Set the font family
        .text(d => d.text); // Set the text content  

    // select all text nodes
    let text = d3.selectAll('text');
    // run the text wrapping function on all text nodes
    text.call(wrap);
}
update();