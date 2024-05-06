// Tamanho automático da área de texto
function autoResize(textArea) {
    textArea.style.height = 'auto';  // Reseta a altura
    textArea.style.height = textArea.scrollHeight + 'px';  // Ajusta a altura baseando-se no conteúdo interno
}

// Preenche o select de estados
document.addEventListener("DOMContentLoaded", async () => {
    const ufSelect = document.getElementById('uf');
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Selecione um estado";
    ufSelect.appendChild(defaultOption);
    try {
        const response = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome");
        const ufs = await response.json();

        ufs.forEach(uf => {
            const option = document.createElement("option");
            option.value = uf.sigla;
            option.textContent = uf.nome;
            ufSelect.appendChild(option);
        });

    } catch (error) {
        console.error("Erro ao carregar os estados:", error);
    }
});

// Preenche o select de cidades
document.getElementById('uf').addEventListener('change', async (event) => {
    const citySelect = document.getElementById('city');
    citySelect.innerHTML = "<option value>Selecione a Cidade</option>";
    try {
        const uf = event.target.value;
        const request = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
        const cities = await request.json();
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city.nome;
            option.textContent = city.nome;
            citySelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao carregar as cidades:", error);

    }
})



// Preenche os campos do formulário e envia os dados para outro componente
document.getElementById('updateForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const address = document.getElementById('address').value;
    const bio = document.getElementById('bio').value;
    const uf = document.getElementById('uf').value;
    const city = document.getElementById('city').value;
    const district = document.getElementById('district').value;



    document.getElementById('userName').textContent = name;
    document.getElementById('userAge').textContent =  age;
    document.getElementById('userAddress').textContent = `Rua/Av.: ${address}`;
    document.getElementById('userDistrict').textContent = `Bairro: ${district}`;
    document.getElementById('userBio').textContent = bio;
    document.getElementById('userCity').textContent = `Cidade: ${city}`;    
    document.getElementById('userUf').textContent = `Estado: ${uf}`;

    document.querySelector('.container-form').style.display = 'none';
    document.querySelector('.user-info').style.display = 'block ';
});

// Exibe o formulário de edição ao clicar no botão de edição
document.getElementById('editButton').addEventListener('click', () => {
    document.getElementById('name').value = document.getElementById('userName').textContent;
    document.getElementById('age').value = document.getElementById('userAge').textContent.split(": ")[1];
    document.getElementById('address').value = document.getElementById('userAddress').textContent.split(": ")[1];
    document.getElementById('bio').value = document.getElementById('userBio').textContent.split(": ")[1];

    document.querySelector('.user-info').style.display = 'none';
    document.querySelector('.container-form').style.display = 'block';
});


// Adiciona entrada de arquivo para a imagem de perfil e corta a imagem
let cropper;
let croppedImage;

document.getElementById('profileImage').addEventListener('change', (e) => {
    let file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Cria um overlay para escurecer o fundo
            let overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            overlay.style.zIndex = '999';
            document.body.appendChild(overlay);

            // Cria um modal para exibir a imagem
            let modal = document.createElement('div');
            modal.style.position = 'fixed';
            modal.style.padding = '1em';
            modal.style.top = '50%';
            modal.style.left = '50%';
            modal.style.transform = 'translate(-50%, -50%)';
            modal.style.backgroundColor = 'white';
            modal.style.zIndex = '1000';
            modal.style.width = '70vh';
            modal.style.height = '70vh';
            modal.style.display = 'flex';
            modal.style.flexDirection = 'column';
            modal.style.justifyContent = 'flex-start';  
            modal.style.alignItems = 'center';

            // Cria uma div para conter a imagem
            let imgContainer = document.createElement('div');
            imgContainer.style.width = '100%';  
            imgContainer.style.height = '90%';  
            modal.appendChild(imgContainer);

            // Cria a imagem dentro da div
            let img = document.createElement('img');
            img.id = 'image';
            img.src = e.target.result;
            img.style.width = '100%';  
            img.style.height = '100%';  
            img.style.objectFit = 'contain';  
            imgContainer.appendChild(img);  

            // Cria o botão de cortar
            let cropButton = document.createElement('button');
            cropButton.innerText = 'Cortar';
            cropButton.style.display = 'block';  
            cropButton.style.marginTop = '1em';  
            cropButton.style.height = 'auto';  
            cropButton.addEventListener('click', () => {
                cropper.getCroppedCanvas().toBlob((blob) => {
                    let croppedImage = blob;

                    // Atualiza a imagem de visualização com a imagem cortada
                    let croppedImageURL = URL.createObjectURL(croppedImage);
                    document.getElementById('userImage').src = croppedImageURL;

                    // Remove o modal e o overlay do corpo do documento
                    document.body.removeChild(modal);
                    document.body.removeChild(overlay);
                });
            });
            modal.appendChild(cropButton);

            // Adiciona o modal ao corpo do documento
            document.body.appendChild(modal);

            let cropper = new Cropper(img, {
                aspectRatio: 1, // torna o cortador quadrado
         
            });
        };
        reader.readAsDataURL(file);
    }
});


// Substitui o arquivo original pelo arquivo cortado
document.getElementById('yourForm').addEventListener('submit', (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append('profileImage', croppedImage);
});

