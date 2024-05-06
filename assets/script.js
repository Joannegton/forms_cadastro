// Tamanho automático da área de texto
function autoResize(textArea) {
    textArea.style.height = 'auto';  // Reseta a altura
    textArea.style.height = textArea.scrollHeight + 'px';  // Ajusta a altura baseando-se no conteúdo interno
}

// Função para criar e adicionar uma opção a um select
function appendOption(select, value, text) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = text;
    select.appendChild(option);
}

// Função para buscar os estados
async function fetchUfs() {
    const response = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome");
    return await response.json();
}

// Função para preencher o select de estados
async function populateUfSelect() {
    const ufSelect = document.getElementById('uf');
    appendOption(ufSelect, "", "Selecione um estado");

    try {
        const ufs = await fetchUfs();
        ufs.forEach(uf => appendOption(ufSelect, uf.sigla, uf.nome));
    } catch (error) {
        console.error("Erro ao carregar os estados:", error);
    }
}

// Função para buscar as cidades de um estado
async function fetchCities(uf) {
    const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
    return await response.json();
}

// Função para preencher o select de cidades
async function populateCitySelect(event) {
    const citySelect = document.getElementById('city');
    citySelect.innerHTML = "<option value>Selecione a Cidade</option>";

    try {
        const uf = event.target.value;
        const cities = await fetchCities(uf);
        cities.forEach(city => appendOption(citySelect, city.nome, city.nome));
    } catch (error) {
        console.error("Erro ao carregar as cidades:", error);
    }
}

// Função para preencher os campos do formulário e enviar os dados para outro componente
function updateForm(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const address = document.getElementById('address').value;
    const bio = document.getElementById('bio').value;
    const uf = document.getElementById('uf').value;
    const city = document.getElementById('city').value;
    const district = document.getElementById('district').value;

    document.getElementById('userName').textContent = name;
    document.getElementById('userAge').textContent =  `Idade: ${age} anos`;
    document.getElementById('userAddress').textContent = `${address}`;
    document.getElementById('userDistrict').textContent = `Bairro: ${district}`;
    document.getElementById('userBio').textContent = bio;
    document.getElementById('userCity').textContent = `Cidade: ${city}`;    
    document.getElementById('userUf').textContent = `Estado: ${uf}`;

    document.querySelector('.container-form').style.display = 'none';
    document.querySelector('.user-info').style.display = 'block ';
}

// Função para exibir o formulário de edição ao clicar no botão de edição
function editForm() {
    document.getElementById('name').value = document.getElementById('userName').textContent;
    document.getElementById('age').value = document.getElementById('userAge').textContent.split(' ')[1];
    document.getElementById('address').value = document.getElementById('userAddress').textContent;
    document.getElementById('bio').value = document.getElementById('userBio').textContent;

    document.querySelector('.user-info').style.display = 'none';
    document.querySelector('.container-form').style.display = 'block';
}

// Função para adicionar entrada de arquivo para a imagem de perfil e cortar a imagem
let cropper;
let croppedImage;

function cropImage(e) {
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
            cropButton.style.marginTop = '0.6em';  
            cropButton.style.height = 'auto'; 
            cropButton.className = 'btn btn-primary'; 
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

            document.body.appendChild(modal);

            let cropper = new Cropper(img, {
                aspectRatio: 1, // torna o cortador quadrado
         
            });
        };
        reader.readAsDataURL(file);
    }
}

// Função para substituir o arquivo original pelo arquivo cortado
function submitForm(e) {
    e.preventDefault();

    let formData = new FormData();
    formData.append('profileImage', croppedImage);
}

// Adiciona os event listeners
document.addEventListener("DOMContentLoaded", populateUfSelect);
document.getElementById('uf').addEventListener('change', populateCitySelect);
document.getElementById('updateForm').addEventListener('submit', updateForm);
document.getElementById('editButton').addEventListener('click', editForm);
document.getElementById('profileImage').addEventListener('change', cropImage);
document.getElementById('yourForm').addEventListener('submit', submitForm);