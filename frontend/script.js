async function fetchLaunchpadCollections() {
    const url = 'http://localhost:3000/proxy/launchpad-collections';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayCollections(data);
    } catch (error) {
        console.error('Error fetching Launchpad collections:', error);
        document.getElementById('launchpad-collections').innerText = 'Failed to fetch Launchpad collections.';
    }
}
