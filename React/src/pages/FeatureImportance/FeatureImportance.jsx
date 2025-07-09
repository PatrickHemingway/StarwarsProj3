import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, CartesianGrid
} from 'recharts';
import styles from './FeatureImportance.module.css';

export default function FeatureImportanceChart() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/feature-importance')
            .then((res) => res.json())
            .then((json) => {
                const cleaned = json.map(item => ({
                    Feature: item.Feature
                        .replace(/^homeworld_/, '')
                        .replace(/^unit_type_/, '')
                        .replace(/_/g, ' '),
                    Importance: item.Importance,
                }));
                setData(cleaned.sort((a, b) => b.Importance - a.Importance));
            })
            .catch(err => console.error("Fetch error:", err));
    }, []);

    return (
        <div className={styles.chartWrapper}>
            <h2 className={styles.chartTitle}>Feature Importance</h2>

            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 10, right: 30, left: 150, bottom: 10 }}
                >
                    <CartesianGrid stroke="#444" strokeDasharray="3 3" />
                    <XAxis
                        type="number"
                        stroke="#fff"
                        tick={{
                            fill: '#fff',
                            fontSize: 14,
                            fontWeight: 'bold',
                            fontFamily: 'Segoe UI, sans-serif',
                        }}
                    />

                    <YAxis
                        type="category"
                        dataKey="Feature"
                        stroke="#fff"
                        tick={{
                            fill: '#fff',
                            fontSize: 14,
                            fontWeight: 'bold',
                            fontFamily: 'Segoe UI, sans-serif',
                        }}
                        width={180}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#222',
                            border: '1px solid #555',
                            color: '#fff',
                            fontFamily: 'Segoe UI, sans-serif',
                            fontSize: 14,
                            fontWeight: 'bold',
                        }}
                        labelStyle={{
                            color: '#fff',
                            fontWeight: 'bold',
                            fontFamily: 'Segoe UI, sans-serif',
                        }}
                        itemStyle={{
                            color: '#fff',
                            fontFamily: 'Segoe UI, sans-serif',
                        }}
                        formatter={(value) => value.toFixed(4)}
                    />
                    <Bar dataKey="Importance" fill="#3b82f6" radius={[5, 5, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
