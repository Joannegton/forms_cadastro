

document.getElementById('updateForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const address = document.getElementById('address').value;
    const bio = document.getElementById('bio').value;

    document.getElementById('userName').textContent = name;
    document.getElementById('userAge').textContent = `Idade: ${age}`;
    document.getElementById('userAddress').textContent = `Endereço: ${address}`;
    document.getElementById('userBio').textContent = `Biografia: ${bio}`;

    document.querySelector('.container-form').style.display = 'none';
    document.querySelector('.user-info').style.display = 'block ';
});

document.getElementById('editButton').addEventListener('click', function() {
    document.getElementById('name').value = document.getElementById('userName').textContent;
    document.getElementById('age').value = document.getElementById('userAge').textContent.split(": ")[1];
    document.getElementById('address').value = document.getElementById('userAddress').textContent.split(": ")[1];
    document.getElementById('bio').value = document.getElementById('userBio').textContent.split(": ")[1];

    document.querySelector('.user-info').style.display = 'none';
    document.querySelector('.container-form').style.display = 'block';
});

function autoResize(textArea) {
    textArea.style.height = 'auto';  // Reseta a altura
    textArea.style.height = textArea.scrollHeight + 'px';  // Ajusta a altura baseando-se no conteúdo interno
}


let cropper;
let croppedImage;

document.getElementById('profileImage').addEventListener('change', function(e) {
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
            modal.style.justifyContent = 'flex-start';  // Alterado para 'flex-start' para alinhar a imagem e o botão ao topo do modal
            modal.style.alignItems = 'center';

            // Cria uma div para conter a imagem
            let imgContainer = document.createElement('div');
            imgContainer.style.width = '100%';  // Definido para '100%' para fazer a div ocupar toda a largura do modal
            imgContainer.style.height = '90%';  // Definido para '80%' para fazer a div ocupar 80% da altura do modal
            modal.appendChild(imgContainer);

            // Cria a imagem dentro da div
            let img = document.createElement('img');
            img.id = 'image';
            img.src = e.target.result;
            img.style.width = '100%';  // Definido para '100%' para fazer a imagem ocupar toda a largura da div
            img.style.height = '100%';  // Definido para '100%' para fazer a imagem ocupar toda a altura da div
            img.style.objectFit = 'contain';  // Mantido como 'contain' para garantir que a imagem seja redimensionada mantendo a proporção
            imgContainer.appendChild(img);  // Adiciona a imagem à div em vez do modal


            // Cria o botão de cortar
            let cropButton = document.createElement('button');
            cropButton.innerText = 'Cortar';
            cropButton.style.display = 'block';  // Adicionado para garantir que o botão seja exibido abaixo da imagem
            cropButton.style.marginTop = '1em';  // Adicionado para adicionar algum espaço acima do botão
            cropButton.style.height = 'auto';  // Adicionado para permitir que o flexbox gerencie o tamanho do botão
            cropButton.addEventListener('click', function() {
                cropper.getCroppedCanvas().toBlob(function(blob) {
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

// Quando o formulário for enviado, substitua o arquivo original pelo arquivo cortado
document.getElementById('yourForm').addEventListener('submit', function(e) {
    e.preventDefault();

    let formData = new FormData();
    formData.append('profileImage', croppedImage);
});